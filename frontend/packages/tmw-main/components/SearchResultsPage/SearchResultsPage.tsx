import * as React from 'react';
import { useRouter } from 'next/router';
import { APIBasicTag } from 'tmw-admin/constants/api-types';
import { useViewport } from 'tmw-common/components/ViewportProvider';
import { ajaxPost } from 'tmw-common/utils/ajax';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { PageLayout } from 'tmw-main/components/PageLayout';
import { SearchResultsList } from 'tmw-main/components/SearchResultsList';
import { SearchResultsPageTitle } from 'tmw-main/components/SearchResultsPageTitle';
import { ShareButton } from 'tmw-main/components/ShareButton';
import { APIResource } from 'tmw-main/constants/api-types';
import { SIZES, VIEWPORT_BREAKPOINTS } from 'tmw-main/constants/app-constants';
import { BasicTag, Resource } from 'tmw-main/constants/app-types';
import { serializeBasicTagsFromAPI, serializeResourcesFromAPI } from 'tmw-main/utils/api-serialize';
import { parseSearchTags } from 'tmw-main/utils/tags-search-url';
import noResultsImage from 'tmw-main/assets/images/no-results-error.svg';

import styles from './SearchResultsPage.module.scss';

export const SearchResultsPage: React.FunctionComponent = () => {
    const { width } = useViewport();
    const isMobileViewport = width < VIEWPORT_BREAKPOINTS.MOBILE;

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [resultResources, setResultResources] = React.useState<Resource[]>([]);
    const [mainSearchTag, setMainSearchTag] = React.useState<BasicTag>();
    const [relatedSearchTags, setRelatedSearchTags] = React.useState<BasicTag[]>([]);

    const router = useRouter();
    const { searchTags } = router.query;

    const fetchSearchResults = (selectedTags: string[]): Promise<void> => {
        setIsLoading(true);
        return ajaxPost('resources/search', { tags: selectedTags })
            .then((response: { data: { resources: APIResource[]; tags: APIBasicTag[] } }) => {
                const serializedResources = serializeResourcesFromAPI(
                    response.data.resources || [],
                );
                setResultResources(serializedResources);
                const tags = serializeBasicTagsFromAPI(response.data.tags || []);
                if (tags.length > 0) {
                    setMainSearchTag(tags[0]);
                    setRelatedSearchTags(tags.slice(1));
                }
            })
            .catch(() => {
                // TODO: Add errors and no-results handling
            });
    };

    React.useEffect(() => {
        const parsedSearchTags =
            searchTags && typeof searchTags === 'string' ? parseSearchTags(searchTags) : [];
        fetchSearchResults(parsedSearchTags).finally(() => {
            setIsLoading(false);
        });
    }, []);

    const hasResults = resultResources.length > 0;

    return (
        <PageLayout>
            <div className={styles.searchResultsPage}>
                <DocumentHead title={mainSearchTag?.name || 'Search'} />
                {!isMobileViewport ? <div className={styles.topSpacing} /> : null}
                <div className={styles.header}>
                    <SearchResultsPageTitle
                        hasResults={hasResults}
                        isLoading={isLoading}
                        mainSearchTag={mainSearchTag}
                        relatedSearchTags={relatedSearchTags}
                    />
                    <ShareButton
                        size={isMobileViewport ? SIZES.SMALL : SIZES.MEDIUM}
                        className={styles.button}
                    />
                </div>
                {isLoading || hasResults ? (
                    <SearchResultsList resultsList={resultResources} isLoading={isLoading} />
                ) : (
                    <div className={styles.noResults}>
                        <img
                            src={noResultsImage}
                            alt="Not Found"
                            className={styles.noResultsImage}
                        />
                    </div>
                )}
            </div>
        </PageLayout>
    );
};
