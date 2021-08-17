import * as React from 'react';

import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner: React.FunctionComponent = () => (
    <div className={styles.loadingSpinner}>
        <div className={styles.point1}></div>
        <div className={styles.point2}></div>
        <div className={styles.point3}></div>
        <div className={styles.point4}></div>
    </div>
);
