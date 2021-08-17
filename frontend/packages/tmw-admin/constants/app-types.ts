export interface Contact {
    id: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: Date;
}

export interface WebsiteSuggestion {
    id: string;
    url: string;
    description: string;
    read: boolean;
    createdAt: Date;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    primary: boolean;
    disabled: boolean;
    deletedAt: Date | null;
}

export interface ResourceTag {
    tagId: string;
    belonging: number;
    tag: Tag;
}

export interface TagsMap {
    [id: string]: Tag;
}

export interface Resource {
    id: string;
    name: string;
    description: string;
    url: string;
    iconFilename: string;
    locale: string;
    score: number;
    interfaceScore: number;
    renown: number;
    priceId: string;
    typeId: string;
    likes: number;
    createdAt: Date;
    tags: ResourceTag[];
    priceName: string;
    typeName: string;
}

export interface Price {
    id: string;
    name: string;
    slug: string;
}

export interface ResourceType {
    id: string;
    name: string;
    slug: string;
}

export interface Log {
    id: string;
    description: string;
    level: string;
    routeUri: string | null;
    routeMethod: string | null;
    geoipContinent: string | null;
    geoipTimezone: string | null;
    geoipCountry: string | null;
    geoipStateName: string | null;
    geoipCity: string | null;
    createdAt: Date;
}

export interface VisitorStat {
    date: Date;
    visitors_count: number;
    new_visitors_count: number;
}

export interface SearchTagStat {
    count: number;
    id: string;
    name: string;
    slug: string;
    primary: boolean;
}

export interface GeneralAdminSearchResult {
    id: string;
    title: string;
    type: string;
}

export interface GeneralAdminSearch {
    name: string;
    slug: string;
    results: GeneralAdminSearchResult[];
}

export interface StatTagBaseDateStructure {
    date: Date;
    count: number;
}

export interface StatTagBaseStructure {
    totalCount: number;
    detailedCount: StatTagBaseDateStructure[];
}

export interface StatRelatedTag {
    id: string;
    name: string;
    slug: string;
    weight: number;
    stats: StatTagBaseStructure;
}

export interface StatTag {
    id: string;
    name: string;
    slug: string;
    weight: number;
    primary: boolean;
    relatedTags: StatRelatedTag[];
    stats: StatTagBaseStructure;
}
