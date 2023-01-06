import {TokenModel} from "./TokenModel";
import {User} from "./User";

export interface ContextInterface {
    isAuthenticated: boolean;
    accesstoken?: TokenModel | null,
    user?: User | null,
    canLogin: () => void;
    canLogout: () => void;
}