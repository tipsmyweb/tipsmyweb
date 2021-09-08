import * as React from 'react';
import { StatsTagsChart } from 'tmw-admin/components/StatisticsPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={StatsTagsChart} />;
export default Page;
