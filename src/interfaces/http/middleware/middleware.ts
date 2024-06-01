import axios from "axios";
import { Request, Response } from "express";
import { ErrorEvent } from "../../../util/errorHandle";
import { StatusHandle } from "../statusHandle/StatusHandle";

export type TUserRoles = "public" | "user" | "admin";

export default async function middleware(req: Request, res: Response, roles: TUserRoles[], next: any) {
    try {
        req.body.userLogged = "SISTEMA";
        const verificarPublic = roles.includes("public");
        if (verificarPublic) {
            return next(req, res);
        }
        const accessToken = req.header("Authorization");

        if (!accessToken) {
            return StatusHandle(res, { status: 403, data: "Não autorizado" });
        }
        const result_userInfo = await getUserInfo(accessToken);
        const result_roles_userinfo = getRolesUser(result_userInfo);

        if (!result_roles_userinfo) return StatusHandle(res, { status: 403, data: "Não autorizado" });
        if (result_roles_userinfo.length == 0) return StatusHandle(res, { status: 403, data: "Não autorizado" });
        const result = verifyRoles(roles, result_roles_userinfo);
        if (result) {
            req.body.userInfo = result_userInfo;
            req.body.userLogged = result_userInfo.sub;
            req.body.userRoles = result_roles_userinfo;
            return next(req, res);
        } else {
            return StatusHandle(res, { status: 403, data: "Não autorizado" });
        }
    } catch (error: any) {
        if (error.message == "Request failed with status code 401") return StatusHandle(res, { status: 401, message: "Não autorizado" });
        return StatusHandle(res, { data: error.message, status: 500, message: "Erro no servidor" });
    }
}

export function verifyRoles(rolesPermitidas: TUserRoles[], rolesDoUsuario: string[]): boolean {
    const result = rolesPermitidas.some((role: any) => {
        const procura_roles = rolesDoUsuario.includes(role);
        if (procura_roles) {
            return role;
        }
    });
    return result;
}
export function getRolesUser(userInfo: any): string[] {
    try {
        const roles = userInfo["resource_access"][`${process.env.KEYCLOAK_CLIENT_ID}`]["roles"];
        if (!roles || roles.length == 0) {
            return [];
        }
        return roles;
    } catch (error) {
        return [];
    }
}

export async function getUserInfo(accessToken: any): Promise<any> {
    try {
        const url = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.status != 200) {
            return new ErrorEvent({ message: "Erro ao buscar informações do usuário", level: "critical", entity: "getUserInfo" }).throw();
        }

        return response.data;
    } catch (error: any) {
        return new ErrorEvent({ message: error.message, level: "critical", entity: "getUserInfo" }).throw();
    }
}
