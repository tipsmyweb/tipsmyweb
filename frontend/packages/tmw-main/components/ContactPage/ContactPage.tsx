import { useRouter } from 'next/router';
import * as React from 'react';
import { ContactForm } from 'tmw-main/components/ContactForm';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { PageLayout } from 'tmw-main/components/PageLayout';
import { MAIN_APP_ROUTES } from 'tmw-main/constants/app-constants';

import styles from './ContactPage.module.scss';

export const ContactPage: React.FunctionComponent = () => {
    const router = useRouter();
    return (
        <PageLayout>
            <div>
                <DocumentHead title="Contact us" />
                <div className={styles.container}>
                    <ContactForm
                        finishedLabel="BACK HOME"
                        finishedAction={() => router.push(MAIN_APP_ROUTES.HOME)}
                    />
                </div>
            </div>
        </PageLayout>
    );
};
