import { ResourceTag } from 'tmw-admin/constants/app-types';

export const wrapText = (input: string, maxLength: number): string => {
    if (input && input.length > maxLength) {
        return `${input.substr(0, maxLength)}...`;
    }
    return input;
};


export const wrapTagsDisplay = (input: ResourceTag[], maxLength: number): ResourceTag[] => {
    if (input && input.length > maxLength) {
        return input.slice(0, maxLength);
    }
    return input;
};
