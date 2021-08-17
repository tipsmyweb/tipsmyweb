import Head from 'next/head';
import * as React from 'react';
import type { AppProps } from 'next/app';
import 'tmw-admin/styles/global-styles.scss';
import 'semantic-ui-css/semantic.min.css';
import { PageLayout } from 'tmw-admin/components/PageLayout';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
require('tmw-common/config/config');

function MyApp({ Component, pageProps, router }: AppProps): React.ReactNode {
    return (
        <>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/app.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff8140" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
                <title>TipsMyWeb Admin</title>
            </Head>
            {router.pathname.startsWith(ADMIN_APP_ROUTES.LOGIN) ? (
                <Component {...pageProps} />
            ) : (
                <PageLayout>
                    <Component {...pageProps} />
                </PageLayout>
            )}
        </>
    );
}

export default MyApp;
