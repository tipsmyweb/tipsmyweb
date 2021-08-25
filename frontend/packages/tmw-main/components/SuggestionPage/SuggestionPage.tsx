import * as React from 'react';
import { useRouter } from 'next/router';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { SuggestionForm } from 'tmw-main/components/SuggestionForm';
import { MAIN_APP_ROUTES } from 'tmw-main/constants/app-constants';
import { PageLayout } from 'tmw-main/components/PageLayout';

import styles from './SuggestionPage.module.scss';

export const SuggestionPage: React.FunctionComponent = () => {
    const router = useRouter();
    return (
        <PageLayout>
            <div>
                <DocumentHead title="Share a website" />
                <div className={styles.container}>
                    <SuggestionForm
                        finishedLabel="BACK HOME"
                        finishedAction={() => router.push(MAIN_APP_ROUTES.HOME)}
                    />
                </div>
            </div>
        </PageLayout>
    );
};
