import {User} from "../models/User";
import {TokenModel} from "../models/TokenModel";

export class BaseService {
   static key = 'static-567trgkhh-reviewit-9762mobi';

    static setSessionData = (data: any) => {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    static clearSessionData(): void {
        localStorage.removeItem(this.key);
    }

    static getTimeLeft = (firstdate: any, seconddate: any) => {
        return Math.abs(new Date(firstdate).getTime() - new Date(seconddate).getTime())/1000;
    }
}
export const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}