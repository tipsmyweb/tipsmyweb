export const convertResourceFileNameToImageName = (fileName: string): string => {
    if (!fileName) return 'undefined';

    return fileName.split('.')[0];
};
