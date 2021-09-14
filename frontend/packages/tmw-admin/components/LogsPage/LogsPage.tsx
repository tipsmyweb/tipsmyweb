import * as React from 'react';
import { Label, Loader, Popup, Table, Pagination } from 'semantic-ui-react';
import { wrapText } from '../../utils/content-wrapper';
import { MAX_CONTENT_LENGTH } from '../../constants/app-constants';
import { getApiDateFormat, getTimeFromApiDate } from 'tmw-common/utils/date';
import { ajaxPost } from 'tmw-common/utils/ajax';
import { serializePaginatedLogsFromAPI } from '../../utils/api-serialize';
import { Log, PaginatedData } from '../../constants/app-types';
import { PageHeader } from '../PageHeader';
import { ActionMessage } from '../ActionMessage';
import { SyntheticEvent } from 'react';
import { PaginationProps } from 'semantic-ui-react/dist/commonjs/addons/Pagination/Pagination';

export const LogsPage: React.FunctionComponent = () => {
    const [logs, setLogs] = React.useState<PaginatedData<Log>>();
    const [activePage, setActivePage] = React.useState<number>(1);
    const [totalPage, setTotalPage] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const defaultBoundaryRange = 0;

    const fetchLogs = async (page = 1): Promise<void> => {
        setIsLoading(true);
        const current_date = new Date();
        return ajaxPost(`logs?page=${page}`, { date: getApiDateFormat(current_date) })
            .then(res => {
                const logs = serializePaginatedLogsFromAPI(res.data);
                setLogs(logs);
                setTotalPage(logs.lastPage);
            })
            .catch(() => {
                setErrorMessage('Error while fetching logs list from API.');
            });
    };

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

    const onPaginationChange = function (event: SyntheticEvent, data: PaginationProps): void {
        const newActivePage = Number(data.activePage);
        setActivePage(newActivePage);
        fetchLogs(newActivePage).finally(() => setIsLoading(false));
    };

    React.useEffect(() => {
        fetchLogs().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="list alternate"
                headerContent="Logs"
                subHeaderContent="List of logs generated in TipsMyWeb"
            />

            <ActionMessage type="error" message={errorMessage} />

            {isLoading ? (
                <Loader active inline="centered" />
            ) : (
                <div>
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
                            {logs?.data.map(log => (
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
                    <Pagination
                        totalPages={totalPage}
                        activePage={activePage}
                        boundaryRange={defaultBoundaryRange}
                        onPageChange={onPaginationChange}
                    />
                </div>
            )}
        </div>
    );
};
