import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { PageLayout } from 'tmw-main/components/PageLayout';
import { TagsSelector } from 'tmw-main/components/TagsSelector';

import styles from './SearchPage.module.scss';

export const SearchPage: React.FunctionComponent = () => {
    return (
        <PageLayout>
            <div className={styles.searchPage}>
                <DocumentHead title="Home" />
                <div className={styles.topSpacing} />
                <p className={styles.title}>
                    Let&apos;s find the most <span className={styles.titleBold}>useful</span>{' '}
                    websites for your <span className={styles.titleBold}>workflow</span>
                </p>
                <TagsSelector />
                <div className={styles.helpContainer}>
                    <div className={styles.helpContent}>
                        <span className={styles.helpContentText}>
                            TipsMyWeb makes you discover new web resources to help with your day to
                            day workflow.
                            <br />
                            <span className={styles.helpSmall}>
                                Start by selecting tags corresponding to your subject of interest.
                            </span>
                        </span>
                        <FontAwesomeIcon className={styles.helpContentIcon} icon={faQuestion} />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};
