import * as React from 'react';
import { Header } from 'semantic-ui-react';

interface PageHeaderProps {
    iconName: string;
    headerContent: string;
    subHeaderContent: string;
}

export const PageHeader: React.FunctionComponent<PageHeaderProps> = ({
    iconName,
    headerContent,
    subHeaderContent,
}) => (
    <Header dividing as="h3" icon={iconName} content={headerContent} subheader={subHeaderContent} />
);
