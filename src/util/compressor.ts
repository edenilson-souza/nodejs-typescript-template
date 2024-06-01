import archiver from "archiver";
import * as crypto from "crypto";
import * as fs from "fs";
import path from "path";
import streamBuffers from "stream-buffers";
import unzipper from "unzipper";
import { promisify } from "util";
const unlink = promisify(fs.unlink);

export function compressFile(
    filePath: string,
    level: number = 9,
    output: { writeFile: boolean; outputPath: string; deleteFile?: boolean }
): Promise<Buffer | void> {
    return new Promise((resolve, reject) => {
        let outputStreamBuffer = new streamBuffers.WritableStreamBuffer({
            initialSize: 1000 * 1024,
            incrementAmount: 1000 * 1024
        });

        const archive = archiver("zip", { zlib: { level: level } });

        archive.on("warning", (err: any) => {
            if (err.code === "ENOENT") {
                console.warn(err);
            } else {
                return reject(err);
            }
        });

        archive.on("error", (err: any) => {
            return reject(err);
        });

        archive.pipe(outputStreamBuffer);

        archive.append(fs.createReadStream(filePath), { name: filePath });
        archive.finalize();

        archive.on("finish", () => {
            outputStreamBuffer.end();
            outputStreamBuffer.on("finish", () => {
                const buffer: any = outputStreamBuffer.getContents();
                if (!buffer) return reject(new Error("Buffer is null"));

                if (!output || !output.writeFile) return resolve(buffer);

                if (!output.outputPath) return reject(new Error("Output path is null"));

                const outputPath = `${output.outputPath}.zip`;
                fs.writeFile(outputPath, buffer, async function () {
                    if (output.deleteFile) {
                        await deleteFile(filePath);
                    }
                    return resolve();
                });
            });
        });
    });
}

export function decompressFile(filePath: string, output: { type: "File" | "Buffer"; outputPath?: string; deleteFile?: boolean }): Promise<Buffer | void> {
    return new Promise((resolve, reject) => {
        const zipStream = fs.createReadStream(filePath);

        let buffer: undefined | Buffer;

        zipStream
            .pipe(unzipper.Parse())
            .on("entry", (entry: any) => {
                entry.buffer().then((data: Buffer) => {
                    buffer = data;
                    entry.autodrain();
                });
            })
            .on("finish", () => {
                if (output.type == "Buffer") {
                    return resolve(buffer);
                } else if (output.type == "File") {
                    if (!buffer || buffer.length === 0) {
                        return reject(new Error("Buffer is null"));
                    }
                    if (!output.outputPath) {
                        return reject(new Error("Output path is null"));
                    }
                    const outputPath = `${output.outputPath}`;
                    fs.writeFile(outputPath, buffer, async err => {
                        if (err) return reject(err);
                        if (output.deleteFile) {
                            await deleteFile(filePath);
                        }
                        return resolve(undefined);
                    });
                } else {
                    return reject();
                }
            })
            .on("error", (err: any) => {
                return reject(err);
            });
    });
}

function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

export function extractZip(zipFilePath: string, destinationDirectory: string) {
    return new Promise<void>((resolve, reject) => {
        const zipStream = fs.createReadStream(zipFilePath);

        zipStream
            .pipe(unzipper.Parse())
            .on("entry", (entry) => {
                const filePath = path.join(destinationDirectory, entry.path);
                ensureDirectoryExistence(filePath);
                entry.pipe(fs.createWriteStream(filePath));
            })
            .on("finish", () => {
                resolve();
            })
            .on("error", (err) => {
                reject(err);
            });
    });
}

export function generateFileHash(filePath: string, algorithm: string = "sha256"): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);

        stream.on("data", data => {
            hash.update(data);
        });

        stream.on("end", () => {
            const fileHash = hash.digest("hex");
            resolve(fileHash);
        });

        stream.on("error", error => {
            reject(error);
        });
    });
}

async function deleteFile(filePath: string): Promise<void> {
    await Promise.all([unlink(filePath)]);
}

//EXEMPLO DE USO
// const filePath = process.argv[2];
// const filePathFileName = process.argv[3];
// const filePathZip = filePath + ".zip";
// const outputDirectoryZip = "./";
// const hashs: string[] = [];
// generateFileHash(filePath, "sha256").then(hash => {
//     hashs.push(hash);
//     compressFile(filePath, 3, { writeFile: true, outputPath: filePathFileName, deleteFile: true }).then(async data => {
//         decompressFile(filePathZip, { type: "File", outputPath: outputDirectoryZip, deleteFile: true }).then(async () => {
//             generateFileHash(filePath, "sha256")
//                 .then(hash => {
//                     hashs.push(hash);
//                 })
//                 .finally(() => {
//                     console.log(hashs);
//                 });
//         });
//     });
// });

// Exemplo de uso
// const filePath = process.argv[2];
// const algorithm = "sha256";
// generateFileHash(filePath, algorithm)
//     .then(hash => {
//         console.log(`Hash do arquivo ${filePath}: ${hash}`);
//     })
//     .catch(error => {
//         console.error(`Erro ao gerar o hash: ${error.message}`);
//     });
