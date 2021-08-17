import * as React from 'react';
import { CookiesProvider } from 'react-cookie';
import { ViewportProvider } from 'tmw-common/components/ViewportProvider';
import { LayoutFooter } from 'tmw-main/components/LayoutFooter';
import { LayoutHeader } from 'tmw-main/components/LayoutHeader';
import { ToastMessageProvider } from 'tmw-main/components/ToastMessage';

import styles from './PageLayout.module.scss';

export const PageLayout: React.FunctionComponent = ({ children }) => (
    <CookiesProvider>
        <ViewportProvider>
            <ToastMessageProvider>
                <div className={styles.pageLayout}>
                    <LayoutHeader />
                    {children}
                    <LayoutFooter />
                </div>
            </ToastMessageProvider>
        </ViewportProvider>
    </CookiesProvider>
);
