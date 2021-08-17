import * as React from 'react';
import { IconProps } from 'tmw-main/icons/icon-types';

export const MagnifyingGlassIcon: React.FunctionComponent<IconProps> = ({
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
        viewBox="0 0 136 136"
    >
        <path
            fill={fill}
            d="M41.2,80.7c-16.6-23.1-11.1-55,12.4-71.3s56-10.9,72.6,12.2c16.6,23.1,11.1,55-12.4,71.3c-16.8,11.6-38.9,12.5-56.6,2.3
		    l-38.4,37.5c-4.1,4.3-11,4.5-15.4,0.4C-1,129-1.1,122.2,3,117.9c0.1-0.1,0.3-0.3,0.4-0.4L41.2,80.7z M83.7,84.2
		    c18.5,0,33.6-14.8,33.6-33c0-18.2-15-33-33.6-33c-18.5,0-33.6,14.7-33.6,32.9C50.1,69.4,65.1,84.2,83.7,84.2
		    C83.7,84.2,83.7,84.2,83.7,84.2z"
        />
    </svg>
);
