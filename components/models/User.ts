import {Organization} from "./Organization";
import {Role} from "./Role";

export interface User {
    email: string;
    firstName: string;
    id: string;
    image: string;
    lastName: string;
    organisationId?: string;
    organization?: Organization;
    role?: Role;
}