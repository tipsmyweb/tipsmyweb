import * as React from 'react';
import { Message } from 'semantic-ui-react';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { StatsTagsChart } from './StatsTagsChart';
import { StatsVisitorsChart } from './StatsVisitorsChart';

export const StatisticsPage: React.FunctionComponent = () => {
    return (
        <div>
            <PageHeader
                iconName="chart bar outline"
                headerContent="Statistics"
                subHeaderContent="Detailed statistics about TipsMyWeb"
            />

            <Message info>
                <Message.Header>Stats Tags</Message.Header>
                <StatsTagsChart />
                <StatsVisitorsChart />
            </Message>
        </div>
    );
};
