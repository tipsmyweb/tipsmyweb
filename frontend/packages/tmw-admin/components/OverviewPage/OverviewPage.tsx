import * as React from 'react';
import { Message, Loader, Table, Label, Popup } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { VisitorsChart } from 'tmw-admin/components/OverviewPage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { serializeVisitorStatFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet } from 'tmw-common/utils/ajax';
import { VisitorStat } from 'tmw-admin/constants/app-types';

export const OverviewPage: React.FunctionComponent = () => {
    const [visitorsStat, setVisitorStat] = React.useState<VisitorStat>(Object);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const fetchVisitorNumbers = async (): Promise<void> => {
        return ajaxGet('stats/visitors/current')
            .then(res => {
                setVisitorStat(serializeVisitorStatFromAPI(res.data));
            })
            .catch(() => {
                setErrorMessage('Error while fetching visitors number from API.');
            });
    };

    React.useEffect(() => {
        fetchVisitorNumbers().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="list alternate"
                headerContent="Overview"
                subHeaderContent="Main statistics about TipsMyWeb"
            />

            <ActionMessage type="error" message={errorMessage} />

            {/* Visitor stats */}
            {isLoading ? (
                <Loader active inline="centered" />
            ) : (
                <Message info>
                    <Message.Header>Stats</Message.Header>
                    <p>
                        Number of visitors today : <strong>{visitorsStat.visitors_count}</strong>
                        <br />
                        Number of new visitors today :{' '}
                        <strong>{visitorsStat.new_visitors_count}</strong>
                    </p>
                    <VisitorsChart />
                </Message>
            )}
        </div>
    );
};
