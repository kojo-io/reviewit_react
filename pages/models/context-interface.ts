import {TokenModel} from "./TokenModel";
import {User} from "./User";
import {LoginResponseModel} from "./LoginResponseModel";

export interface ContextInterface {
    isAuthenticated: boolean;
    accesstoken?: TokenModel | null,
    user?: User | null,
    canLogin: (value: LoginResponseModel) => void;
    canLogout: () => void;
}