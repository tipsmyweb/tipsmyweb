/* eslint-disable @typescript-eslint/camelcase */

export interface LoginAPIResponse {
    token: string;
}

// WARNING This is duplicated in tmw-common
export enum APIAuthenticationErrors {
    EXPIRED_TOKEN = 'expired_token',
    UNKNOWN_TOKEN = 'unknown_token',
    UNDEFINED_TOKEN = 'undefined_token',
}

export enum APILoginErrors {
    BAD_CREDENTIALS = 'bad_credentials',
}

export interface APIContact {
    id: string;
    email: string;
    message: string;
    read: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface APIWebsiteSuggestion {
    id: string;
    url: string;
    description: string;
    read: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface APIBasicTag {
    id: string;
    name: string;
    slug: string;
    primary: boolean;
    disabled: boolean;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
}

export interface APITag extends APIBasicTag {
    resource_tags: APIBasicTag[]; // Duplicate of the same tag object ??
}

export interface APIPrice {
    id: string;
    slug: string;
    name: string;
    created_at: Date;
    updated_at: Date | null;
}

export interface APIResourceType {
    id: string;
    name: string;
    slug: string;
    created_at: Date;
    updated_at: Date | null;
}

export interface APIResourceTag {
    id: number;
    resource_id: string;
    tag_id: string;
    belonging: number;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    tag: APIBasicTag;
}

export interface APIResource {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string; // filename ('xxx.png')
    language: string; // locale ('fr')
    score: number;
    interface: number;
    renown: number;
    price_id: string;
    type_id: string;
    like: number;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    resource_tags: APIResourceTag[];
    tags: Pick<APIResourceTag, 'tag_id' | 'belonging'>[]; // Used only for POST/PUT
    price: APIPrice;
    type: APIResourceType;
}

export interface APILogRoute {
    id: string;
    uri: string;
    method: string;
    controller: string;
    created_at: Date;
    updated_at: Date;
}

export interface APILogGeoip {
    id: string;
    continent: string;
    timezone: string;
    country: string;
    state_name: string;
    city: string;
    created_at: Date;
    updated_at: Date;
}

export interface APILog {
    id: string;
    description: string;
    level: string;
    route: APILogRoute;
    geoip: APILogGeoip;
    created_at: Date;
    updated_at: Date;
}

export interface APIVisitorStat {
    date: Date;
    visitors_count: number;
    new_visitors_count: number;
}

export interface APISearchTagStat {
    count: number;
    tag_id: string;
    tag: APITag;
}

export interface APIGeneralAdminSearchResult {
    id: string;
    title: string;
}

export interface APIGeneralAdminSearch {
    name: string;
    slug: string;
    results: APIGeneralAdminSearchResult[];
}

export interface APIStatTagBaseDateStructure {
    date: Date;
    count: number;
}

export interface APIStatTagBaseStructure {
    total_count: number;
    detailed_count: APIStatTagBaseDateStructure[];
}

export interface APIStatRelatedTag {
    id: string;
    name: string;
    slug: string;
    weight: number;
    stats: APIStatTagBaseStructure;
}

export interface APIStatTag {
    id: string;
    name: string;
    slug: string;
    weight: number;
    primary: boolean;
    related_tags: APIStatRelatedTag[];
    stats: APIStatTagBaseStructure;
}

export interface APIDateRanges {
    start_date: string;
    end_date: string;
}

export interface APIPaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
}
