import { Resource, RelatedTag, MainTag, BasicTag } from 'tmw-main/constants/app-types';
import { APIResource, APIMainTag, APIRelatedTag, APIBasicTag } from 'tmw-main/constants/api-types';
import { LOCALES, PRICING_OPTIONS } from 'tmw-main/constants/app-constants';

export const serializeBasicTagsFromAPI = (tagsFromAPI: APIBasicTag[]): BasicTag[] => {
    const tags: BasicTag[] = [];

    tagsFromAPI.forEach((tag: APIBasicTag) => {
        tags.push({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
        });
    });

    return tags;
};

export const serializeMainTagsFromAPI = (tagsFromAPI: APIMainTag[]): MainTag[] => {
    const tags: MainTag[] = [];

    tagsFromAPI.forEach((tag: APIMainTag) => {
        const relatedTags: RelatedTag[] = [];
        tag.related_tags.forEach((secondaryTag: APIRelatedTag) => {
            relatedTags.push({
                id: secondaryTag.id,
                name: secondaryTag.name,
                slug: secondaryTag.slug,
                weight: secondaryTag.weight,
            });
        });
        tags.push({
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            primary: tag.primary,
            weight: tag.weight,
            relatedTags: relatedTags,
        });
    });

    return tags;
};

export const serializeResourcesFromAPI = (resourcesFromAPI: APIResource[]): Resource[] => {
    const resources: Resource[] = [];

    resourcesFromAPI.forEach((resource: APIResource) => {
        resources.push({
            id: resource.id,
            name: resource.name,
            description: resource.description,
            url: resource.url,
            iconFilename: resource.image,
            locale: resource.language as LOCALES,
            pricing: resource.price.name as PRICING_OPTIONS,
        });
    });

    return resources;
};
