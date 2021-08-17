import * as React from 'react';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { PageLayout } from 'tmw-main/components/PageLayout';

import styles from './AboutPage.module.scss';

export const AboutPage: React.FunctionComponent = () => {
    return (
        <PageLayout>
            <div className={styles.aboutPage}>
                <DocumentHead title="About" />
                <div className={styles.header}>About us</div>
                <div className={styles.content}>
                    <p>
                        TipsMyWeb 2222 is giving you the best resources in a specific field. These
                        websites that you normally discover after 2 years in a specific domain.
                    </p>
                    <p>
                        This project has been created by two students after seeing that too many
                        people are struggling in their daily workflow, and they don’t imagine how
                        much developer have created awesome websites to help them.
                    </p>
                    <p>Created by Josselin Pennors, Lancelot Imberton & Hugo Jouffre</p>
                </div>
            </div>
        </PageLayout>
    );
};
