/*
 * Search tags are encoded in url like this : tag1&tag2&tag3
 * This function parses the url and returns the array of tags.
 */
export const parseSearchTags = (searchTagsString: string): string[] => {
    return searchTagsString.split('&');
};

export const encodeSearchTags = (searchTagsSlugs: string[]): string => {
    return searchTagsSlugs.join('&');
};
