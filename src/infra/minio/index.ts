import { ReadStream } from "fs";
import * as Minio from "minio";

export class File {
    constructor(public readonly bucketName: string, public readonly objectName: string, public readonly data: string | Buffer | ReadStream | undefined) {}
}

export interface FileService {
    uploadFile(file: File): Promise<string>;
    downloadFile(file: File, filePath?: string): Promise<string>;
}

export class UploadFileUseCase {
    constructor(private readonly fileService: FileService) {}

    async execute(file: File): Promise<string> {
        return await this.fileService.uploadFile(file);
    }
}

export class DownloadFileUseCase {
    constructor(private readonly fileService: FileService) {}

    async execute(file: File, filePath?: string): Promise<string> {
        return await this.fileService.downloadFile(file, filePath);
    }
}

export class MinioFileService implements FileService {
    private readonly minioClient: Minio.Client;

    constructor(minioClient: Minio.Client) {
        this.minioClient = minioClient;
    }

    uploadFile(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!file.data) reject("File data is undefined");
            this.minioClient.putObject(file.bucketName, file.objectName, file.data!, "application/octet-stream" as any, (err: any, etag: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(etag);
                }
            });
        });
    }

    downloadFile(file: File, filePath?: string): Promise<string> {
        const destinationPath = filePath ?? `/tmp/${file.objectName}`;

        return new Promise((resolve, reject) => {
            const getVersionIdentificatorDestinationPath: any = (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(destinationPath);
                }
            };

            this.minioClient.fGetObject(file.bucketName, file.objectName, destinationPath, getVersionIdentificatorDestinationPath);
        });
    }
}

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT!),
    useSSL: false,
    // region: process.env.MINIO_REGION,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!
});

const minioFileService = new MinioFileService(minioClient);
const uploadFileUseCase = new UploadFileUseCase(minioFileService);
const downloadFileUseCase = new DownloadFileUseCase(minioFileService);

export default minioClient;
export { downloadFileUseCase, uploadFileUseCase };
