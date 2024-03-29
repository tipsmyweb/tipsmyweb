import Head from 'next/head';
import * as React from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import 'tmw-main/styles/global-styles.scss';
require('tmw-common/config/config');
import registerServiceWorker from '../public/service-worker';
import * as gtag from '../utils/gtag';

// TODO a bug from next js breaks fontawesome when adding <link>. The following 3 lines fix it but they should be removed when it's fixed nby next js.
import { config as fontawesomeConfig } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
fontawesomeConfig.autoAddCss = false;

const DESCRIPTION = 'Discover great web resources to help with your day to day workflow.';
const TITLE = 'TipsMyWeb - Find the best resources for your projects';
const WEBSITE_URL = 'https://www.tipsmyweb.com/';
const WEBSITE_IMAGE = 'https://www.tipsmyweb.com/og-image.png';

function MyApp({ Component, pageProps }: AppProps): React.ReactNode {
    React.useEffect(() => {
        if ('serviceWorker' in navigator) {
            registerServiceWorker();
        }
    });

    const router = useRouter();
    React.useEffect(() => {
        const handleRouteChange = (url: URL) => {
            gtag.pageview(url);
        };
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                {/* Favicons / Themes */}
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/app.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff8140" />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#f46d7b" />

                {/* Primary Meta Tags */}
                <title>{TITLE}</title>
                <meta name="title" content="TipsMyWeb" />
                <meta name="description" content={DESCRIPTION} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={WEBSITE_URL} />
                <meta property="og:title" content={TITLE} />
                <meta property="og:description" content={DESCRIPTION} />
                <meta property="og:image" content={WEBSITE_IMAGE} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={WEBSITE_URL} />
                <meta property="twitter:title" content={TITLE} />
                <meta property="twitter:description" content={DESCRIPTION} />
                <meta property="twitter:image" content={WEBSITE_IMAGE} />

                {/* Global Site Tag (gtag.js) - Google Analytics */}
                <script
                    async
                    src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${gtag.GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                          });
                      `,
                    }}
                />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
