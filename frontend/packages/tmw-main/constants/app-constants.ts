export enum SIZES {
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
}

export enum VIEWPORT_BREAKPOINTS {
    MOBILE = 450,
}

export enum PRICING_OPTIONS {
    FREE = 'Free',
    FREEMIUM = 'Freemium',
    PAID = '$$',
}

export enum LOCALES {
    FRENCH = 'fr',
}

export const RESOURCES_BASE_URL = process.env.NEXT_PUBLIC_API_HOST_URL + '/api/resources/image/';

export enum MAIN_APP_ROUTES {
    HOME = '/',
    SEARCH = '/search',
    RESULTS = '/results/:searchTags',
    TERMS = '/terms',
    ABOUT = '/about',
    CONTACT = '/contact',
    SUGGESTION = '/suggestion',
}

export enum VALIDATION {
    EMAIL_MAX_LENGTH = 150,
    URL_MAX_LENGTH = 150,
    MESSAGE_MAX_LENGTH = 500,
    DESCRIPTION_MAX_LENGTH = 250,
    DESCRIPTION_MIN_LENGTH = 10,
}
