import { Role } from "../enum/roles.enum";

export type CurrentUser = {
    id: string;
    role: Role;
};