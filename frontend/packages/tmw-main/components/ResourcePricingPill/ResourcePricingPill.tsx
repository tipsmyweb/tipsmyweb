import classNames from 'classnames';
import * as React from 'react';
import { PRICING_OPTIONS } from 'tmw-main/constants/app-constants';

import styles from './ResourcePricingPill.module.scss';

interface ResourcePricingPillProps {
    pricing: PRICING_OPTIONS;
}

export const ResourcePricingPill: React.FunctionComponent<ResourcePricingPillProps> = ({
    pricing,
}) => (
    <div
        className={classNames(styles.resourcePricingPill, {
            [styles.green]: pricing === PRICING_OPTIONS.FREE,
            [styles.yellow]: pricing === PRICING_OPTIONS.FREEMIUM,
            [styles.red]: pricing === PRICING_OPTIONS.PAID,
        })}
    >
        {pricing}
    </div>
);
