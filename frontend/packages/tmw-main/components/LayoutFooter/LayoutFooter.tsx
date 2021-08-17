import * as React from 'react';
import Link from 'next/link';
import { MAIN_APP_ROUTES } from 'tmw-main/constants/app-constants';
import twitterLogo from 'tmw-main/assets/images/twitter-logo.svg';
import facebookLogo from 'tmw-main/assets/images/facebook-logo.svg';
import shareIcon from 'tmw-main/assets/images/share-icon.svg';

import styles from './LayoutFooter.module.scss';

export const LayoutFooter: React.FunctionComponent = () => (
    <div className={styles.layoutFooter}>
        <div className={styles.leftSide}>
            <p>© 2020 TipsMyWeb</p>
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
            <a href="#">
                <img src={twitterLogo} alt="Share on twitter" className={styles.socialLinkImg} />
            </a>
            <a href="#">
                <img src={facebookLogo} alt="Share on facebook" className={styles.socialLinkImg} />
            </a>
            <a href="#">
                <img src={shareIcon} alt="Share" className={styles.socialLinkImg} />
            </a>
        </div>
    </div>
);
