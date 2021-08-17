import * as React from 'react';
import { Message, Loader, Table, Label, Popup } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { VisitorsChart } from 'tmw-admin/components/OverviewPage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { serializeLogsFromAPI, serializeVisitorStatFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxPost } from 'tmw-common/utils/ajax';
import { getApiDateFormat, getTimeFromApiDate } from 'tmw-common/utils/date';
import { Log, VisitorStat } from 'tmw-admin/constants/app-types';
import { wrapText } from 'tmw-admin/utils/content-wrapper';
import { MAX_CONTENT_LENGTH } from 'tmw-admin/constants/app-constants';

export const OverviewPage: React.FunctionComponent = () => {
    const [visitorsStat, setVisitorStat] = React.useState<VisitorStat>(Object);
    const [logs, setLogs] = React.useState<Log[]>([]);
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

    const fetchLogs = async (): Promise<void> => {
        const current_date = new Date();
        return ajaxPost('logs', { date: getApiDateFormat(current_date) })
            .then(res => {
                const logs = serializeLogsFromAPI(res.data);
                setLogs(logs);
            })
            .catch(() => {
                setErrorMessage('Error while fetching logs list from API.');
            });
    };

    React.useEffect(() => {
        fetchVisitorNumbers().finally(() => {
            setIsLoading(false);
        });
        fetchLogs();
    }, []);

    const getLabelColor = function (logLevel: string) {
        if (logLevel == 'warning') {
            return 'yellow';
        } else if (logLevel == 'error') {
            return 'red';
        } else if (logLevel == 'info') {
            return 'teal';
        } else {
            return 'grey';
        }
    };

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

            {/* Logs table */}
            {isLoading ? (
                ''
            ) : (
                <Table celled fixed striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell>Route</Table.HeaderCell>
                            <Table.HeaderCell>Localisation</Table.HeaderCell>
                            <Table.HeaderCell>Time</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {logs.map(log => (
                            <Table.Row key={log.id}>
                                <Popup
                                    content={log.description}
                                    trigger={
                                        <Table.Cell>
                                            {wrapText(
                                                log.description,
                                                MAX_CONTENT_LENGTH.OVERVIEW_PAGE_LOG_DESCRIPTION,
                                            )}
                                        </Table.Cell>
                                    }
                                />
                                <Table.Cell>
                                    <Label color={getLabelColor(log.level)}>{log.level}</Label>
                                </Table.Cell>
                                <Table.Cell>
                                    {log && log.routeMethod && log.routeUri ? (
                                        <span>
                                            {log.routeMethod}: {log.routeUri}
                                        </span>
                                    ) : (
                                        '--'
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {log && log.geoipCountry && log.geoipStateName ? (
                                        <span>
                                            {log.geoipCountry}/{log.geoipStateName}
                                        </span>
                                    ) : (
                                        '--'
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    <span>{getTimeFromApiDate(log.createdAt)}</span>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
    );
};
