export interface RatingForm{
    id?: string;
    rating: number;
    feedback: string;
    reviewId: string;
    anonymous?: boolean;
    images: Array<string>
}