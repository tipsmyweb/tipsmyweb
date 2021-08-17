import * as React from 'react';
import { BasicTag } from 'tmw-main/constants/app-types';
import { MAIN_APP_ROUTES } from 'tmw-main/constants/app-constants';

import styles from './SearchResultsPageTitle.module.scss';
import { useRouter } from 'next/router';

interface SearchResultsPageTitleProps {
    hasResults: boolean;
    isLoading: boolean;
    mainSearchTag: BasicTag | undefined;
    relatedSearchTags: BasicTag[];
}

export const SearchResultsPageTitle: React.FunctionComponent<SearchResultsPageTitleProps> = ({
    hasResults,
    isLoading,
    mainSearchTag,
    relatedSearchTags,
}) => {
    const router = useRouter();
    const loadSearchPage = (mainTagSlug: string, relatedTagSlug?: string): void => {
        const relatedTagParameter = relatedTagSlug ? `&related=${relatedTagSlug}` : ``;
        const searchRoute = `${MAIN_APP_ROUTES.SEARCH}?main=${mainTagSlug}${relatedTagParameter}`;
        router.push(searchRoute);
    };

    return (
        <div>
            <div className={styles.title}>
                {isLoading || hasResults ? (
                    <>
                        Level-up your <span className={styles.titleEmphasis}>workflow!</span>
                    </>
                ) : (
                    <>{"We didn't find any resource for these tags..."}</>
                )}
            </div>
            <div className={styles.subtitle}>
                {isLoading ? (
                    'Looking for great resources...'
                ) : hasResults && mainSearchTag ? (
                    <>
                        <span className={styles.primarySearchTagSeparator}>/</span>
                        <span
                            className={styles.primarySearchTag}
                            onClick={(): void => loadSearchPage(mainSearchTag?.slug)}
                        >
                            {mainSearchTag.name}
                        </span>
                        {relatedSearchTags.map(tag => (
                            <React.Fragment key={tag.id}>
                                <span className={styles.secondarySearchTagSeparator}>/</span>
                                <span
                                    className={styles.secondarySearchTag}
                                    onClick={(): void =>
                                        loadSearchPage(mainSearchTag?.slug, tag.slug)
                                    }
                                >
                                    {tag.name}
                                </span>
                            </React.Fragment>
                        ))}
                    </>
                ) : (
                    'Please try to broaden the scope of your search'
                )}
            </div>
        </div>
    );
};
