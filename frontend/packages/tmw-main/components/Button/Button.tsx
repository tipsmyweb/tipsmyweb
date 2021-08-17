import * as React from 'react';
import classNames from 'classnames';
import { SIZES } from 'tmw-main/constants/app-constants';
import { Icon } from 'tmw-main/icons/icon-types';

import styles from './Button.module.scss';

export enum ButtonVariant {
    COLORED = 'colored',
    WHITE_TEXT_COLORED = 'white-text-colored',
    WHITE_TEXT_BLACK = 'white-text-black',
}

type ButtonSize = SIZES.SMALL | SIZES.MEDIUM;

const BUTTON_SIZES_STYLES: Record<ButtonSize, string> = {
    [SIZES.SMALL]: styles.sizeSmall,
    [SIZES.MEDIUM]: styles.sizeMedium,
};

const BUTTON_VARIANTS_STYLES: Record<ButtonVariant, string> = {
    [ButtonVariant.COLORED]: styles.variantColored,
    [ButtonVariant.WHITE_TEXT_BLACK]: styles.variantWhiteTextBlack,
    [ButtonVariant.WHITE_TEXT_COLORED]: styles.variantWhiteTextColored,
};

export interface ButtonProps {
    content: string;
    onClick?: () => void;
    icon?: Icon;
    variant?: ButtonVariant;
    className?: string;
    size?: ButtonSize;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
    content,
    onClick,
    icon: Icon,
    variant = ButtonVariant.WHITE_TEXT_COLORED,
    className,
    size = SIZES.MEDIUM,
}) => {
    let iconColor;
    switch (variant) {
        case ButtonVariant.COLORED:
            iconColor = '#FFFFFF';
            break;
        case ButtonVariant.WHITE_TEXT_BLACK:
            iconColor = '#474747';
            break;
        case ButtonVariant.WHITE_TEXT_COLORED:
        default:
            iconColor = '#F46D7B';
            break;
    }

    return (
        <span
            className={classNames(
                className,
                styles.button,
                BUTTON_VARIANTS_STYLES[variant],
                BUTTON_SIZES_STYLES[size],
            )}
            onClick={onClick}
        >
            {content}
            {Icon ? (
                <span className={styles.icon}>
                    <Icon fill={iconColor} />
                </span>
            ) : null}
        </span>
    );
};
