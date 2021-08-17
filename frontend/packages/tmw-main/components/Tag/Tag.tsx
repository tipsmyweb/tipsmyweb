import classNames from 'classnames';
import * as React from 'react';
import { SIZES } from 'tmw-main/constants/app-constants';

import styles from './Tag.module.scss';

interface TagProps {
    content: string;
    isSelected: boolean;
    onClickCallback?: () => void;
    size?: SIZES.MEDIUM | SIZES.LARGE;
    clickable?: boolean;
}

export const Tag: React.FunctionComponent<TagProps> = ({
    content,
    isSelected,
    onClickCallback,
    size = SIZES.MEDIUM,
    clickable = true,
}) => (
    <div onClick={onClickCallback}>
        <button
            className={classNames(styles.tag, {
                [styles.selected]: isSelected,
                [styles.medium]: size === SIZES.MEDIUM,
                [styles.large]: size === SIZES.LARGE,
                [styles.clickable]: clickable,
            })}
        >
            {content}
        </button>
    </div>
);
