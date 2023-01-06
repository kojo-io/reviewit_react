import {Organisation} from "./Organisation";
import {Role} from "./Role";

export interface User {
    email: string;
    firstName: string;
    id: string;
    image: string;
    lastName: string;
    organization: Organisation;
    role: Role;
}