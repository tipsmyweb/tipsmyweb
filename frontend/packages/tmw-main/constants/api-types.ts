/* eslint-disable @typescript-eslint/camelcase */

interface APIBasicModel {
    id: string;
    created_at: Date;
    updated_at: Date | null;
    deleted_at?: Date | null;
}

export interface APIBasicTag extends APIBasicModel {
    name: string;
    slug: string;
}

export interface APIRelatedTag extends APIBasicTag {
    weight: number;
}

export interface APIMainTag extends APIBasicTag {
    primary: boolean;
    weight: number;
    related_tags: APIRelatedTag[];
}

export interface APIPrice extends APIBasicModel {
    slug: string;
    name: string;
}

export interface APIResource extends APIBasicModel {
    name: string;
    description: string;
    url: string;
    image: string; // filename ('xxx.png')
    language: string; // locale ('fr')
    score: number;
    interface: number;
    price_id: string;
    type_id: string;
    like: number;
    search_score: number;
    price: APIPrice;
}
