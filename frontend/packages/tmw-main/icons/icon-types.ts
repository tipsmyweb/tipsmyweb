import * as React from 'react';

export interface IconProps {
    fill?: string;
    width?: string | number;
    className?: string;
}

export type Icon = React.FunctionComponent<IconProps>;
