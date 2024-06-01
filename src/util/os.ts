import os from "os";
export function getCommonNetworkInterface(): string[] {
    const networkInterfaces = os.networkInterfaces();

    if (os.platform() === "win32") {
        // No Windows, podemos procurar por uma interface que contenha "Ethernet" no nome
        const commonInterfaces = Object.values(networkInterfaces)
            .flat()
            .filter(
                (netInterface: any) => netInterface.family === "IPv4" && netInterface.internal === false && /Ethernet/i.test(netInterface!.internal.family)
            );

        if (commonInterfaces.length === 0) {
            const commonInterfaces = Object.values(networkInterfaces)
                .flat()
                .filter((netInterface: any) => netInterface.family === "IPv4" && netInterface.internal === false);
            return commonInterfaces.map((netInterface: any) => netInterface.address);
        }

        return commonInterfaces.map((netInterface: any) => netInterface.address);
    } else if (os.platform() === "darwin") {
        // No macOS, a interface comum geralmente é a 'en0'
        const en0Interface = networkInterfaces["en0"];
        if (en0Interface && en0Interface.length > 0) {
            return en0Interface.map((netInterface: any) => netInterface.address);
        }
    } else if (os.platform() === "linux") {
        // No Linux, podemos procurar por interfaces não internas
        const commonInterfaces = Object.values(networkInterfaces)
            .flat()
            .filter((netInterface: any) => netInterface.family === "IPv4" && netInterface.internal === false);
        return commonInterfaces.map((netInterface: any) => netInterface.address);
    }
    const commonInterfaces = Object.values(networkInterfaces)
        .flat()
        .filter((netInterface: any) => netInterface.family === "IPv4" && netInterface.internal === false);
    return commonInterfaces.map((netInterface: any) => netInterface.address);
}
