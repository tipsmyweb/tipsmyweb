import * as React from 'react';
import Link from 'next/link';
import { MAIN_APP_ROUTES, EXTERNAL_LINKS } from 'tmw-main/constants/app-constants';
import facebookLogo from 'tmw-main/assets/images/facebook-logo.svg';
import instagram from 'tmw-main/assets/images/instagram-logo.svg';
// ToDO Later
//import twitterLogo from 'tmw-main/assets/images/twitter-logo.svg';
//import shareIcon from 'tmw-main/assets/images/share-icon.svg';

import styles from './LayoutFooter.module.scss';

export const LayoutFooter: React.FunctionComponent = () => (
    <div className={styles.layoutFooter}>
        <div className={styles.leftSide}>
            <p>© 2021 TipsMyWeb</p>
            <p>
                <Link href={MAIN_APP_ROUTES.TERMS}>
                    <a>Terms</a>
                </Link>
            </p>
            <p>
                <Link href={MAIN_APP_ROUTES.ABOUT}>
                    <a>About</a>
                </Link>
            </p>
        </div>
        <div>
            <a href={EXTERNAL_LINKS.INSTAGRAM} target="_blank" rel="noreferrer">
                <img
                    src={instagram.src}
                    alt="Share on Instagram"
                    className={styles.socialLinkImg}
                />
            </a>
            <a href={EXTERNAL_LINKS.FACEBOOK} target="_blank" rel="noreferrer">
                <img
                    src={facebookLogo.src}
                    alt="Share on Facebook"
                    className={styles.socialLinkImg}
                />
            </a>
            {/*
            ToDO Later
            <a href="#">
                <img src={shareIcon.src} alt="Share" className={styles.socialLinkImg} />
            </a>*/}
        </div>
    </div>
);
