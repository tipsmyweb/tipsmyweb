import * as React from 'react';
import { IconProps } from 'tmw-main/icons/icon-types';

export const TickIcon: React.FunctionComponent<IconProps> = ({
    fill = '#ffffff',
    width = '100%',
    className = '',
}) => (
    <svg
        width={width}
        height={width}
        xmlns="http://www.w3.org/2000/svg"
        className={`${className}`}
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 24 24"
    >
        <path
            fill={fill}
            d="m.828 13.336c-.261.304-.388.691-.357 1.091s.215.764.52 1.024l7.403 6.346c.275.235.616.361.974.361.044 0 .089-.002.134-.006.405-.036.77-.229 1.028-.542l12.662-15.411c.254-.31.373-.7.334-1.099-.04-.399-.231-.759-.541-1.014l-2.318-1.904c-.639-.524-1.585-.432-2.111.207l-9.745 11.861-3.916-3.355c-.628-.536-1.576-.465-2.115.163z"
        />
    </svg>
);
