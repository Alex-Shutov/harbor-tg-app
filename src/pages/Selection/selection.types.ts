import {AgeRating} from "../Events/events.types.ts";
import {CostLevelEnum} from '@pages/Establishment/components/details/details.types.ts';
import { IApiCategory } from '@shared/types';

interface MainImageInfo {
    id: number;
    name?: string;
    url: string;
}




export interface FoodEstablishmentContent {
    id: number;
    type: 'FOOD_ESTABLISHMENT';
    mainImg: MainImageInfo;
    title: string;
    description: string;
    categories:IApiCategory[]
    serialNumber: number;
    inFavorites: boolean;
    costLevel: CostLevelEnum;
}

export interface EventContent {
    id: number;
    type: 'EVENT';
    mainImg: MainImageInfo;
    title: string;
    description: string;
    categories:IApiCategory[]
    serialNumber: number;
    inFavorites: boolean;
    ageRating: AgeRating;
}

export interface LeisureContent {
    id: number;
    type: 'LEISURE';
    mainImg: MainImageInfo;
    title: string;
    description: string;
    categories:IApiCategory[]
    serialNumber: number;
    inFavorites: boolean;
    costLevel: CostLevelEnum;
}



export type ContentObject = FoodEstablishmentContent | EventContent | LeisureContent;

export interface SelectionInfoResponse {
    mainImg: MainImageInfo;
    title: string;
    description: string;
    contentObjects: ContentObject[];
}
