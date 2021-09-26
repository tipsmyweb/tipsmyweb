import * as React from 'react';
import { DropdownProps, Form, Message } from 'semantic-ui-react';
import { serializeDateRangesToAPI, serializeStatsTagsFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxPost } from 'tmw-common/utils/ajax';
import { convertToSelectOptions, InputSelectOption } from 'tmw-admin/utils/select-options';
import { StatTag } from 'tmw-admin/constants/app-types';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { DatesRangeInput } from 'semantic-ui-calendar-react';
import {
    getApiFormatEndDateFromSemanticCalendarValue,
    getApiFormatStartDateFromSemanticCalendarValue,
    isSemanticCalendarValueValue,
    serializeSemanticCalendarValueToCurrentDate,
} from 'tmw-admin/utils/semantic-calendar';
import { getStatisticsTabSearchTagsChart } from 'tmw-admin/utils/chart';
import { Chart } from 'chart.js/auto';
import { STATS_CHART_NAMES, STATS_DEFAULT_PERIOD_DAYS } from '../../constants/app-constants';

export const StatsTagsChart: React.FunctionComponent = () => {
    const [selectedTagOption, setSelectedTagOption] = React.useState<string>('primaries');
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [statsTimeRange, setStatsTimeRange] = React.useState<string>('');
    const [statsTags, setStatsTags] = React.useState<StatTag[]>([]);
    const [chart, setChart] = React.useState<Chart>();

    const getParentTagOptions = (): InputSelectOption[] => {
        let options: InputSelectOption[] = [
            {
                key: 'primaries',
                value: 'primaries',
                text: 'Main Tags',
            },
            {
                key: 'best_primaries',
                value: 'best_primaries',
                text: 'Best Main Tags',
            },
            {
                key: 'best_secondaries',
                value: 'best_secondaries',
                text: 'Best Secondary Tags',
            },
        ];

        options = options.concat(
            convertToSelectOptions(
                statsTags.filter(t => t.primary),
                'id',
                'name',
            ),
        );

        return options;
    };

    const getBestTags = (primary: boolean, quantity = 10): StatTag[] => {
        return statsTags
            .filter(t => t.primary == primary)
            .sort((a, b) => {
                return a.stats.totalCount > b.stats.totalCount ? -1 : 1;
            })
            .slice(0, quantity);
    };

    const selectLabels = (tagId: string): string[] => {
        const selectedMainTag = statsTags.find(t => t.id === tagId);

        if (selectedMainTag == null) return [];

        return [selectedMainTag.name].concat(selectedMainTag.relatedTags.map(rt => rt.name));
    };

    const selectDefaultLabels = (): string[] => {
        return statsTags.filter(t => t.primary).map(t => t.name);
    };

    const selectBestLabels = (primary: boolean, quantity = 10): string[] => {
        return getBestTags(primary, quantity).map(t => t.name);
    };

    const selectData = (tagId: string): number[] => {
        const selectedMainTag = statsTags.find(t => t.id === tagId);

        if (selectedMainTag == null) return [];

        return [selectedMainTag.stats.totalCount].concat(
            selectedMainTag.relatedTags.map(rt => rt.stats.totalCount),
        );
    };

    const selectDefaultData = (): number[] => {
        return statsTags.filter(t => t.primary).map(t => t.stats.totalCount);
    };

    const selectBestData = (primary: boolean, quantity = 10): number[] => {
        return getBestTags(primary, quantity).map(t => t.stats.totalCount);
    };

    const updateChart = (labels: string[], data: number[]): void => {
        while (chart?.data.labels != null && chart.data.labels.length > 0) {
            chart.data.labels.pop();
        }
        labels.forEach(l => chart?.data.labels?.push(l));
        chart?.data.datasets?.forEach(dataset => {
            dataset.data = data;
        });
        chart?.update();
    };

    const updateChartData = (selectedTagOption: string): void => {
        let labels: string[];
        let data: number[];
        switch (selectedTagOption) {
            case 'primaries':
                labels = selectDefaultLabels();
                data = selectDefaultData();
                break;
            case 'best_primaries':
                labels = selectBestLabels(true);
                data = selectBestData(true);
                break;
            case 'best_secondaries':
                labels = selectBestLabels(false);
                data = selectBestData(false);
                break;
            default:
                labels = selectLabels(selectedTagOption);
                data = selectData(selectedTagOption);
        }

        updateChart(labels, data);
    };

    const onTagOptionInputChange = (
        _: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps,
    ): void => {
        setSelectedTagOption(data.searchQuery ?? '');
        updateChartData(data.searchQuery ?? '');
    };

    const fetchStatTags = async (startDate: Date, endDate: Date): Promise<void> => {
        const apiDateRanges = serializeDateRangesToAPI(startDate, endDate);
        return ajaxPost('stats/tags/search', apiDateRanges)
            .then(res => {
                const statsTagsResults = serializeStatsTagsFromAPI(res.data).sort((a, b) => {
                    return a.stats.totalCount > b.stats.totalCount ? -1 : 1;
                });
                setStatsTags(statsTagsResults);

                const labels = statsTagsResults.filter(t => t.primary).map(t => t.name);
                const data = statsTagsResults.filter(t => t.primary).map(t => t.stats.totalCount);
                updateChart(labels, data);
            })
            .catch(() => {
                setErrorMessage('Error while fetching Stats Tags from API.');
            });
    };

    const handleDateRangesInputChange = (_: any, { value }: { value: string }): void => {
        setStatsTimeRange(value);

        // If Semantic Calendar Value has a StartDate & a EndDate
        if (isSemanticCalendarValueValue(value)) {
            const apiStartDate = getApiFormatStartDateFromSemanticCalendarValue(value);
            const apiEndDate = getApiFormatEndDateFromSemanticCalendarValue(value);

            fetchStatTags(apiStartDate, apiEndDate);
        }
    };

    const initStatTags = async (): Promise<void> => {
        const semanticCalendarValue = serializeSemanticCalendarValueToCurrentDate(
            STATS_DEFAULT_PERIOD_DAYS.STATISTICS_TAB_SEARCH_TAGS,
        );
        isSemanticCalendarValueValue(semanticCalendarValue);
        setStatsTimeRange(semanticCalendarValue);

        const apiStartDate = getApiFormatStartDateFromSemanticCalendarValue(semanticCalendarValue);
        const apiEndDate = getApiFormatEndDateFromSemanticCalendarValue(semanticCalendarValue);

        fetchStatTags(apiStartDate, apiEndDate);
    };

    React.useEffect(() => {
        setChart(getStatisticsTabSearchTagsChart());
    }, []);

    React.useEffect(() => {
        initStatTags();
    }, [chart]);

    return (
        <Message info>
            <Message.Header>Stats Tags</Message.Header>
            <div style={{ marginTop: 20 }}>
                <ActionMessage type="error" message={errorMessage} />
                <Form>
                    <DatesRangeInput
                        onChange={handleDateRangesInputChange}
                        value={statsTimeRange}
                    />
                    <Form.Select
                        fluid
                        placeholder="Select primary tag"
                        options={getParentTagOptions()}
                        value={selectedTagOption}
                        onChange={onTagOptionInputChange}
                    />
                </Form>
                <canvas id={STATS_CHART_NAMES.STATISTICS_TAB_SEARCH_TAGS} />
            </div>
        </Message>
    );
};
