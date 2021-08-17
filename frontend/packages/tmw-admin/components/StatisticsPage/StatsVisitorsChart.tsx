import * as React from 'react';
import { Form } from 'semantic-ui-react';
import {
    serializeDateRangesToAPI,
    serializeVisitorStatsFromAPI,
} from 'tmw-admin/utils/api-serialize';
import { ajaxPost } from 'tmw-common/utils/ajax';
import { VisitorStat } from 'tmw-admin/constants/app-types';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { DatesRangeInput } from 'semantic-ui-calendar-react';
import {
    getApiFormatEndDateFromSemanticCalendarValue,
    getApiFormatStartDateFromSemanticCalendarValue,
    isSemanticCalendarValueValue,
    serializeSemanticCalendarValueToCurrentDate,
} from 'tmw-admin/utils/semantic-calendar';
import {
    getStatisticsTabVisitorsChart,
    visitorsChartNewVisitorsLabelName,
    visitorsChartVisitorsLabelName,
} from 'tmw-admin/utils/chart';
import { Chart } from 'chart.js';
import { STATS_CHART_NAMES, STATS_DEFAULT_PERIOD_DAYS } from '../../constants/app-constants';

export const StatsVisitorsChart: React.FunctionComponent = () => {
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [statsTimeRange, setStatsTimeRange] = React.useState<string>('');
    const [chart, setChart] = React.useState<Chart>();

    const updateChart = (labels: Date[], visitors: number[], newVisitors: number[]): void => {
        while (chart?.data.labels != null && chart.data.labels.length > 0) {
            chart.data.labels.pop();
        }
        labels.forEach(l => chart?.data.labels?.push(l));
        chart?.data.datasets?.forEach(dataset => {
            if (dataset.label == visitorsChartVisitorsLabelName) dataset.data = visitors;
            else if (dataset.label == visitorsChartNewVisitorsLabelName) dataset.data = newVisitors;
        });
        chart?.update();
    };

    const fetchVisitorsTags = async (startDate: Date, endDate: Date): Promise<void> => {
        const apiDateRanges = serializeDateRangesToAPI(startDate, endDate);
        return ajaxPost('stats/visitors/search', apiDateRanges)
            .then(res => {
                const statsVisitorsResults = serializeVisitorStatsFromAPI(res.data);

                const labels = statsVisitorsResults.map(t => t.date);
                const visitors = statsVisitorsResults.map(t => t.visitors_count);
                const newVisitors = statsVisitorsResults.map(t => t.new_visitors_count);
                updateChart(labels, visitors, newVisitors);
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

            fetchVisitorsTags(apiStartDate, apiEndDate);
        }
    };

    const initStatVisitors = async (): Promise<void> => {
        const semanticCalendarValue = serializeSemanticCalendarValueToCurrentDate(
            STATS_DEFAULT_PERIOD_DAYS.STATISTICS_TAB_VISITORS,
        );
        isSemanticCalendarValueValue(semanticCalendarValue);
        setStatsTimeRange(semanticCalendarValue);

        const apiStartDate = getApiFormatStartDateFromSemanticCalendarValue(semanticCalendarValue);
        const apiEndDate = getApiFormatEndDateFromSemanticCalendarValue(semanticCalendarValue);

        fetchVisitorsTags(apiStartDate, apiEndDate);
    };

    React.useEffect(() => {
        setChart(getStatisticsTabVisitorsChart());
    }, []);

    React.useEffect(() => {
        initStatVisitors();
    }, [chart]);

    return (
        <div style={{ marginTop: 20 }}>
            <ActionMessage type="error" message={errorMessage} />
            <Form>
                <DatesRangeInput onChange={handleDateRangesInputChange} value={statsTimeRange} />
            </Form>
            <canvas id={STATS_CHART_NAMES.STATISTICS_TAB_VISITORS} />
        </div>
    );
};
