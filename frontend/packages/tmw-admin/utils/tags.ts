import { Tag, TagsMap } from 'tmw-admin/constants/app-types';

export const buildTagsMap = (tags: Tag[]): TagsMap => {
    const tagsMap: TagsMap = {};

    tags.forEach(tag => {
        if (tag.id in tagsMap) {
            console.error('Some tags have the same ID!');
        } else {
            tagsMap[tag.id] = tag;
        }
    });

    return tagsMap;
};
