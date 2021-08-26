import * as React from 'react';
import Link from 'next/link';
import { Button } from 'tmw-main/components/Button';
import { DocumentHead } from 'tmw-main/components/DocumentHead';
import { MAIN_APP_ROUTES } from 'tmw-main/constants/app-constants';
import { ArrowRightIcon } from 'tmw-main/icons/ArrowRightIcon';
import notFoundErrorIcon from 'tmw-main/assets/images/not-found-error.svg';

import styles from './NotFoundErrorPage.module.scss';

export const NotFoundErrorPage: React.FunctionComponent = () => {
    return (
        <div className={styles.notFoundErrorPage}>
            <DocumentHead title="Page not found" />
            <div className={styles.content}>
                <img src={notFoundErrorIcon.src} alt="Not Found" className={styles.image} />
                <div className={styles.title}>Page not found</div>
                <div className={styles.subtitle}>We sincerely apologize</div>
            </div>
            <div className={styles.backButton}>
                <Link href={MAIN_APP_ROUTES.HOME}>
                    <Button content="Back to Home Page" icon={ArrowRightIcon} />
                </Link>
            </div>
        </div>
    );
};
