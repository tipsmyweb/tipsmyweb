export enum LOCALES {
    FRENCH = 'fr',
    ENGLISH = 'en',
    ENGLISH_FRENCH = 'en,fr',
    SPANISH = 'es',
    FRENCH_SPANISH = 'fr,es',
    ENGLISH_SPANISH = 'en,es',
    ENGLISH_FRENCH_SPANISH = 'en,fr,es',
}

export const LOCALES_NAMES = {
    [LOCALES.FRENCH]: 'French',
    [LOCALES.ENGLISH]: 'English',
    [LOCALES.ENGLISH_FRENCH]: 'English / French',
    [LOCALES.SPANISH]: 'Spanish',
    [LOCALES.FRENCH_SPANISH]: 'French / Spanish',
    [LOCALES.ENGLISH_SPANISH]: 'English / Spanish',
    [LOCALES.ENGLISH_FRENCH_SPANISH]: 'English / French / Spanish',
};

export enum MAX_CONTENT_LENGTH {
    OVERVIEW_PAGE_LOG_DESCRIPTION = 25,
    RESOURCES_INDEX_PAGE_URL = 20,
    RESOURCES_INDEX_PAGES_TAGS = 2,
}

export const RESOURCES_IMAGE_BASE_URL =
    process.env.NEXT_PUBLIC_API_HOST_URL + '/api/resources/image/';
export const MAIN_APP_URL = process.env.NEXT_PUBLIC_MAIN_APP_URL;

/*
 * Admin app routes
 */
export enum ADMIN_APP_ROUTES {
    MAIN = '/',
    LOGIN = '/login',
    RESOURCES = '/resources',
    RESOURCES_ADD = '/resources/add',
    RESOURCES_EDIT = '/resources/edit/:id',
    TAGS = '/tags',
    TAGS_ADD = '/tags/add',
    TAGS_EDIT = '/tags/edit/:id',
    PRICES = '/prices',
    PRICES_ADD = '/prices/add',
    PRICES_EDIT = '/prices/edit/:id',
    RESOURCE_TYPES = '/types',
    RESOURCE_TYPES_ADD = '/types/add',
    RESOURCE_TYPES_EDIT = '/types/edit/:id',
    IMPORT = '/import',
    SUGGESTIONS = '/suggestions',
    CONTACT = '/contact',
    STATISTICS = '/statistics',
    STATISTICS_VISITORS = '/statistics/visitors',
    STATISTICS_TAGS = '/statistics/tags',
    LOGS = '/logs',
}

export enum STATS_CHART_NAMES {
    OVERVIEW_TAB_VISITORS = 'overview_visitors',
    STATISTICS_TAB_VISITORS = 'statistics_visitors',
    STATISTICS_TAB_SEARCH_TAGS = 'statistics_search_tags',
}

/**
 * Statistics Default Period
 */
export enum STATS_DEFAULT_PERIOD_DAYS {
    OVERVIEW_TAB_VISITORS = 30,
    STATISTICS_TAB_VISITORS = 30 * 6,
    STATISTICS_TAB_SEARCH_TAGS = 30 * 6,
}
