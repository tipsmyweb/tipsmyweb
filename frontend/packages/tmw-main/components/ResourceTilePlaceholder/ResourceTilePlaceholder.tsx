import classNames from 'classnames';
import * as React from 'react';
import { VIEWPORT_BREAKPOINTS } from 'tmw-main/constants/app-constants';
import { useViewport } from 'tmw-common/components/ViewportProvider';

import styles from './ResourceTilePlaceholder.module.scss';

export const ResourceTilePlaceholder: React.FunctionComponent = () => {
    const { width } = useViewport();
    const isMobileViewport = width < VIEWPORT_BREAKPOINTS.MOBILE;

    return (
        <div className={styles.resourceTilePlaceholder}>
            {!isMobileViewport ? (
                <div className={styles.header}>
                    <span className={styles.headerDot} />
                    <span className={styles.headerDot} />
                    <span className={styles.headerDot} />
                </div>
            ) : null}
            <div className={classNames(styles.icon, styles.loading)} />
            <div className={styles.content}>
                <div className={classNames(styles.title, styles.loading)} />
                <div className={classNames(styles.description1, styles.loading)} />
                <div className={classNames(styles.description2, styles.loading)} />
                <div className={classNames(styles.description3, styles.loading)} />
            </div>
        </div>
    );
};
