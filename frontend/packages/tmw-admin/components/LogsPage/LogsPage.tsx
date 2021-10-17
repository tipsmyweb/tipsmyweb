import * as React from 'react';
import {
    Label,
    Loader,
    Popup,
    Table,
    Pagination,
    Segment,
    Form,
    Grid,
    Dropdown,
    Icon,
} from 'semantic-ui-react';
import { wrapText } from '../../utils/content-wrapper';
import { MAX_CONTENT_LENGTH } from '../../constants/app-constants';
import { getApiDateFormat, getTimeFromApiDate } from 'tmw-common/utils/date';
import { ajaxGet, ajaxPost } from 'tmw-common/utils/ajax';
import {
    serializePaginatedLogsFromAPI,
    serializeFiltersFromAPI,
    serializeFiltersToAPI,
} from '../../utils/api-serialize';
import { Filter, Log, PaginatedData, SortingDirection } from '../../constants/app-types';
import { PageHeader } from '../PageHeader';
import { ActionMessage } from '../ActionMessage';
import { SyntheticEvent } from 'react';
import { PaginationProps } from 'semantic-ui-react/dist/commonjs/addons/Pagination/Pagination';

export const LogsPage: React.FunctionComponent = () => {
    const [logs, setLogs] = React.useState<PaginatedData<Log>>();
    const [logFilters, setLogFilters] = React.useState<Filter[]>([]);
    const [activePage, setActivePage] = React.useState<number>(1);
    const [sortedColumn, setSortedColumn] = React.useState<string>('created_at');
    const [sortedDirection, setSortedDirection] = React.useState<SortingDirection>('descending');
    const [totalPage, setTotalPage] = React.useState<number>(0);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [searchLog, setSearchLog] = React.useState<string>('');
    const [selectedFilters, setSelectedFilters] = React.useState<Filter[]>([]);

    const defaultBoundaryRange = 0;

    const logCreationDateOptions = [
        { key: 'today', text: 'Today', value: 'today' },
        { key: 'last_week', text: 'Last week', value: 'last_week' },
        { key: 'last_two_weeks', text: 'Last 2 weeks', value: 'last_two_weeks' },
        { key: 'last_month', text: 'Last Month', value: 'last_month' },
        { key: 'last_six_months', text: 'Last 6 months', value: 'last_six_months' },
    ];

    const fetchLogs = async (page = 1): Promise<void> => {
        setIsLoading(true);
        const current_date = new Date();
        return ajaxPost(`logs?page=${page}`, {
            date: getApiDateFormat(current_date),
            sort_direction: sortedDirection,
            sort_attribute: sortedColumn,
            search: searchLog.length > 2 ? searchLog : '',
            filters: serializeFiltersToAPI(selectedFilters),
        })
            .then(res => {
                const logs = serializePaginatedLogsFromAPI(res.data);
                setLogs(logs);
                setTotalPage(logs.lastPage);
            })
            .catch(() => {
                setErrorMessage('Error while fetching logs list from API.');
            });
    };

    const fetLogFilters = async (): Promise<void> => {
        return ajaxGet('filters/log')
            .then(res => {
                const logFilters = serializeFiltersFromAPI(res.data);
                setLogFilters(logFilters);
            })
            .catch(() => {
                setErrorMessage('Error while fetching log filters from API.');
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

    const onHeaderCellClick = function (sortedAttribute: string): void {
        setSortedColumn(sortedAttribute);
        if (sortedDirection == 'ascending') setSortedDirection('descending');
        else setSortedDirection('ascending');
    };

    const onSearchInputChange = (_: any, { value }: { value: string }): void => {
        setSearchLog(value);
    };

    const onLogFilterClick = function (attribute: string, value: string): void {
        const index = selectedFilters.findIndex(f => f.attribute == attribute);

        if (index == -1) {
            const newSelectedFilters = selectedFilters.concat([
                { attribute: attribute, values: [value] },
            ]);
            setSelectedFilters(newSelectedFilters);
            return;
        }

        if (selectedFilters[index].values.findIndex(v => v == value) == -1) {
            const newValues = selectedFilters[index].values.concat([value]);
            const newSelectedFilters = selectedFilters
                .filter(f => f.attribute != attribute)
                .concat([{ attribute: attribute, values: newValues }]);
            setSelectedFilters(newSelectedFilters);
        } else {
            const newValues = selectedFilters[index].values.filter(v => v != value);
            const newSelectedFilters = selectedFilters
                .filter(f => f.attribute != attribute)
                .concat([{ attribute: attribute, values: newValues }]);
            setSelectedFilters(newSelectedFilters);
        }
    };

    const isFilterSelected = function (attribute: string, value: string): boolean {
        const attributeIndex = selectedFilters.findIndex(f => f.attribute == attribute);

        if (
            attributeIndex != -1 &&
            selectedFilters[attributeIndex].values.findIndex(v => v == value) != -1
        ) {
            return true;
        }

        return false;
    };

    React.useEffect(() => {
        fetchLogs().finally(() => {
            fetLogFilters();
            setIsLoading(false);
        });
    }, []);

    React.useEffect(() => {
        fetchLogs().finally(() => {
            setIsLoading(false);
        });
    }, [selectedFilters, sortedColumn, sortedDirection, searchLog]);

    React.useEffect(() => {
        fetchLogs(activePage).finally(() => {
            setIsLoading(false);
        });
    }, [activePage]);

    return (
        <div>
            <PageHeader
                iconName="list alternate"
                headerContent="Logs"
                subHeaderContent="List of logs generated in TipsMyWeb"
            />

            <ActionMessage type="error" message={errorMessage} />

            <Segment>
                <Grid>
                    <Grid.Row style={{ paddingBottom: 0 }}>
                        <Grid.Column width={12}>
                            <Form className="attached fluid">
                                <Form.Group widths="equal">
                                    <Form.Input
                                        icon="search"
                                        placeholder="Search ..."
                                        loading={isLoading}
                                        value={searchLog}
                                        onChange={onSearchInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Dropdown
                                placeholder="Date"
                                fluid
                                search
                                selection
                                defaultValue="today"
                                options={logCreationDateOptions}
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ paddingTop: 0 }}>
                        <Grid.Column width={4}>
                            <Dropdown
                                text="Add Filter"
                                icon="filter"
                                floating
                                labeled
                                button
                                className="icon"
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Menu scrolling>
                                        {logFilters.map(logFilter =>
                                            logFilter.values.map(logFilterValue => (
                                                <Dropdown.Item
                                                    key={`${logFilter.attribute}${logFilterValue}`}
                                                    className={
                                                        isFilterSelected(
                                                            logFilter.attribute,
                                                            logFilterValue,
                                                        )
                                                            ? 'selected item active'
                                                            : ''
                                                    }
                                                    onClick={event =>
                                                        onLogFilterClick(
                                                            logFilter.attribute,
                                                            logFilterValue,
                                                        )
                                                    }
                                                >
                                                    {logFilter.attribute} : {logFilterValue}
                                                </Dropdown.Item>
                                            )),
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {selectedFilters.map(filter =>
                                filter.values.map(value => {
                                    return (
                                        <Label
                                            key={`${filter.attribute}${value}`}
                                            style={{ marginBottom: 5, marginRight: 5 }}
                                        >
                                            {filter.attribute}: {value}
                                            <Icon
                                                name="delete"
                                                onClick={() =>
                                                    onLogFilterClick(filter.attribute, value)
                                                }
                                            />
                                        </Label>
                                    );
                                }),
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                <Table celled fixed sortable striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell
                                sorted={sortedColumn == 'description' ? sortedDirection : undefined}
                                onClick={() => onHeaderCellClick('description')}
                            >
                                Description
                            </Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={sortedColumn == 'level' ? sortedDirection : undefined}
                                onClick={() => onHeaderCellClick('level')}
                            >
                                Level
                            </Table.HeaderCell>
                            <Table.HeaderCell>Route</Table.HeaderCell>
                            <Table.HeaderCell>Localisation</Table.HeaderCell>
                            <Table.HeaderCell
                                sorted={sortedColumn == 'created_at' ? sortedDirection : undefined}
                                onClick={() => onHeaderCellClick('created_at')}
                            >
                                Time
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading ? (
                            <Table.Row>
                                <Table.Cell>
                                    <Loader active inline="centered" style={{ margin: 20 }} />
                                </Table.Cell>
                            </Table.Row>
                        ) : (
                            <>
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
                                            <Label color={getLabelColor(log.level)}>
                                                {log.level}
                                            </Label>
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
                            </>
                        )}
                    </Table.Body>
                </Table>
                {!isLoading && (
                    <Pagination
                        totalPages={totalPage}
                        activePage={activePage}
                        boundaryRange={defaultBoundaryRange}
                        onPageChange={onPaginationChange}
                    />
                )}
            </Segment>
        </div>
    );
};
