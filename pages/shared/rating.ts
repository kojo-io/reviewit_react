export interface Rating{
    id: string;
    name: string;
    email: string;
    anonymous: boolean;
    date: Date;
    feedback: string;
    rating: number,
    images: Array<any>,
    notLoggedIn?:boolean;
    user?: any;
    comments?: any;
}