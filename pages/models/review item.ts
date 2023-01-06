import {ItemType} from "./ItemType";

export interface ReviewItem {
    id?:string;
    name: string;
    description: string;
    image: string;
    imageId: string;
    organisationId: string;
    created?: any;
    ratingType: number;
    reviewType?: ItemType;
    active: boolean;
    allowPhoto?: boolean;
    organisation?: any;
}