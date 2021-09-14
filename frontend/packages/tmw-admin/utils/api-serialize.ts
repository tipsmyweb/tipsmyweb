/* eslint-disable @typescript-eslint/camelcase */

import {
    APIContact,
    APITag,
    APIWebsiteSuggestion,
    APIResource,
    APIBasicTag,
    APIPrice,
    APIResourceType,
    APIResourceTag,
    APILog,
    APIVisitorStat,
    APISearchTagStat,
    APIGeneralAdminSearchResult,
    APIGeneralAdminSearch,
    APIStatRelatedTag,
    APIStatTagBaseStructure,
    APIStatTagBaseDateStructure,
    APIStatTag,
    APIDateRanges,
    APIPaginatedData,
} from 'tmw-admin/constants/api-types';
import {
    Contact,
    Tag,
    WebsiteSuggestion,
    Resource,
    Price,
    ResourceType,
    ResourceTag,
    Log,
    VisitorStat,
    SearchTagStat,
    GeneralAdminSearchResult,
    GeneralAdminSearch,
    StatRelatedTag,
    StatTag,
    StatTagBaseDateStructure,
    StatTagBaseStructure,
    PaginatedData,
} from 'tmw-admin/constants/app-types';
import { LOCALES } from 'tmw-admin/constants/app-constants';
import { getApiDateFormat } from 'tmw-common/utils/date';

/*
 * Convert data from API format to frontend format
 */

export const serializeContactsFromAPI = (contactsFromAPI: APIContact[]): Contact[] => {
    return contactsFromAPI.map(contact => ({
        id: contact.id,
        email: contact.email,
        message: contact.message,
        read: contact.read,
        createdAt: contact.created_at,
    }));
};

export const serializeSuggestionsFromAPI = (
    suggestionsFromAPI: APIWebsiteSuggestion[],
): WebsiteSuggestion[] => {
    return suggestionsFromAPI.map(suggestion => ({
        id: suggestion.id,
        url: suggestion.url,
        description: suggestion.description,
        read: suggestion.read,
        createdAt: suggestion.created_at,
    }));
};

export const serializeTagFromAPI = (tagFromAPI: APITag | APIBasicTag): Tag => {
    return {
        id: tagFromAPI.id,
        name: tagFromAPI.name,
        slug: tagFromAPI.slug,
        primary: tagFromAPI.primary,
        disabled: tagFromAPI.disabled,
        deletedAt: tagFromAPI.deleted_at,
    };
};

export const serializeTagsFromAPI = (tagsFromAPI: Array<APITag | APIBasicTag>): Tag[] => {
    return tagsFromAPI.map(tag => serializeTagFromAPI(tag));
};

export const serializeResourceTagsFromAPI = (
    resourceTagsFromAPI: APIResourceTag[],
): ResourceTag[] => {
    return resourceTagsFromAPI.map(resourceTag => ({
        tagId: resourceTag.tag_id,
        belonging: resourceTag.belonging,
        tag: serializeTagsFromAPI([resourceTag.tag])[0],
    }));
};

export const serializeResourceFromAPI = (resourceFromAPI: APIResource): Resource => {
    return {
        id: resourceFromAPI.id,
        name: resourceFromAPI.name,
        description: resourceFromAPI.description,
        url: resourceFromAPI.url,
        iconFilename: resourceFromAPI.image,
        locale: resourceFromAPI.language as LOCALES,
        score: resourceFromAPI.score,
        renown: resourceFromAPI.renown,
        interfaceScore: resourceFromAPI.interface,
        likes: resourceFromAPI.like,
        priceId: resourceFromAPI.price_id,
        typeId: resourceFromAPI.type_id,
        priceName: resourceFromAPI.price.name,
        typeName: resourceFromAPI.type.name,
        createdAt: resourceFromAPI.created_at,
        tags: serializeResourceTagsFromAPI(resourceFromAPI.resource_tags),
    };
};

export const serializeResourcesFromAPI = (resourcesFromAPI: APIResource[]): Resource[] => {
    return resourcesFromAPI.map(resource => serializeResourceFromAPI(resource));
};

export const serializePriceFromAPI = (priceFromAPI: APIPrice): Price => {
    return {
        id: priceFromAPI.id,
        name: priceFromAPI.name,
        slug: priceFromAPI.slug,
    };
};

export const serializePricesFromAPI = (pricesFromAPI: APIPrice[]): Price[] => {
    return pricesFromAPI.map(price => serializePriceFromAPI(price));
};

export const serializeResourceTypeFromAPI = (typeFromAPI: APIResourceType): ResourceType => {
    return {
        id: typeFromAPI.id,
        name: typeFromAPI.name,
        slug: typeFromAPI.slug,
    };
};

export const serializeResourceTypesFromAPI = (typesFromAPI: APIResourceType[]): ResourceType[] => {
    return typesFromAPI.map(type => serializeResourceTypeFromAPI(type));
};

export const serializeLogsFromAPI = (logsFromAPI: APILog[]): Log[] => {
    return logsFromAPI.map(log => ({
        id: log.id,
        description: log.description,
        level: log.level,
        routeUri: log.route?.uri,
        routeMethod: log.route?.method,
        geoipCity: log.geoip?.city,
        geoipContinent: log.geoip?.continent,
        geoipCountry: log.geoip?.country,
        geoipStateName: log.geoip?.state_name,
        geoipTimezone: log.geoip?.timezone,
        createdAt: log.created_at,
    }));
};

export const serializePaginatedLogsFromAPI = (
    paginatedLogsFromAPI: APIPaginatedData<APILog>,
): PaginatedData<Log> => {
    return {
        data: serializeLogsFromAPI(paginatedLogsFromAPI.data),
        currentPage: paginatedLogsFromAPI.current_page,
        lastPage: paginatedLogsFromAPI.last_page,
    };
};

export const serializeVisitorStatsFromAPI = (
    VisitorStatsFromAPI: APIVisitorStat[],
): VisitorStat[] => {
    return VisitorStatsFromAPI.map(stat => serializeVisitorStatFromAPI(stat));
};

export const serializeVisitorStatFromAPI = (VisitorStatFromAPI: APIVisitorStat): VisitorStat => {
    return {
        date: VisitorStatFromAPI.date,
        visitors_count: VisitorStatFromAPI.visitors_count,
        new_visitors_count: VisitorStatFromAPI.new_visitors_count,
    };
};

export const serializeSearchTagsStatsFromAPI = (
    SearchTagsStatsFromAPI: APISearchTagStat[],
): SearchTagStat[] => {
    return SearchTagsStatsFromAPI.map(searchTag => ({
        count: searchTag.count,
        id: searchTag.tag.id,
        name: searchTag.tag.name,
        slug: searchTag.tag.slug,
        primary: searchTag.tag.primary,
    }));
};

export const serializeGeneralAdminSearchResultFromAPI = (
    GeneralAdminSearchResultFromAPI: APIGeneralAdminSearchResult[],
    type: string,
): GeneralAdminSearchResult[] => {
    return GeneralAdminSearchResultFromAPI.map(adminSearchResult => ({
        id: adminSearchResult.id,
        title: adminSearchResult.title,
        type: type,
    }));
};

export const serializeGeneralAdminSearchFromAPI = (
    GeneralAdminSearchFromAPI: APIGeneralAdminSearch[],
): Record<string, GeneralAdminSearch> => {
    const adminSearchDictionnary: Record<string, GeneralAdminSearch> = {};
    GeneralAdminSearchFromAPI.map(
        adminSearch =>
            (adminSearchDictionnary[adminSearch.slug] = {
                name: adminSearch.name,
                slug: adminSearch.slug,
                results: serializeGeneralAdminSearchResultFromAPI(
                    adminSearch.results,
                    adminSearch.slug,
                ),
            }),
    );
    return adminSearchDictionnary;
};

/*
 * Convert data from frontend format to (partial) API format (to use with POST API)
 */

export const serializeResourceToAPI = (resource: Partial<Resource>): Partial<APIResource> => {
    return {
        name: resource.name,
        description: resource.description,
        url: resource.url,
        language: resource.locale,
        score: resource.score,
        interface: resource.interfaceScore,
        price_id: resource.priceId,
        type_id: resource.typeId,
        tags: resource.tags
            ? resource.tags.map(tag => ({
                  tag_id: tag.tagId,
                  belonging: tag.belonging,
              }))
            : [],
    };
};

export const serializeTagToAPI = (tag: Partial<Tag>): Partial<APITag> => {
    return {
        name: tag.name,
        primary: tag.primary,
    };
};

export const serializePriceToAPI = (price: Partial<Price>): Partial<APIPrice> => {
    return {
        name: price.name,
    };
};

export const serializeResourceTypeToAPI = (type: Partial<ResourceType>): Partial<ResourceType> => {
    return {
        name: type.name,
    };
};

export const serializeStatsBaseDateStructureFromAPI = (
    statsTagsBaseDateStructure: APIStatTagBaseDateStructure[],
): StatTagBaseDateStructure[] => {
    return statsTagsBaseDateStructure.map(statTagBaseDateStructure => ({
        count: statTagBaseDateStructure.count,
        date: statTagBaseDateStructure.date,
    }));
};

export const serializeStatsBaseStructureFromAPI = (
    statTagBaseStructure: APIStatTagBaseStructure,
): StatTagBaseStructure => {
    return {
        totalCount: statTagBaseStructure.total_count,
        detailedCount: serializeStatsBaseDateStructureFromAPI(statTagBaseStructure.detailed_count),
    };
};

export const serializeStatsRelatedTagsFromAPI = (
    statsRelatedTagsFromAPI: APIStatRelatedTag[],
): StatRelatedTag[] => {
    return statsRelatedTagsFromAPI.map(statRelatedTag => ({
        id: statRelatedTag.id,
        name: statRelatedTag.name,
        slug: statRelatedTag.slug,
        weight: statRelatedTag.weight,
        stats: serializeStatsBaseStructureFromAPI(statRelatedTag.stats),
    }));
};

export const serializeStatsTagsFromAPI = (TagsStatsFromAPI: APIStatTag[]): StatTag[] => {
    return TagsStatsFromAPI.map(statTag => ({
        id: statTag.id,
        name: statTag.name,
        slug: statTag.slug,
        primary: statTag.primary,
        weight: statTag.weight,
        relatedTags: serializeStatsRelatedTagsFromAPI(statTag.related_tags),
        stats: serializeStatsBaseStructureFromAPI(statTag.stats),
    }));
};

export const serializeDateRangesToAPI = (startDate: Date, endDate: Date): APIDateRanges => {
    return {
        start_date: getApiDateFormat(startDate),
        end_date: getApiDateFormat(endDate),
    };
};
