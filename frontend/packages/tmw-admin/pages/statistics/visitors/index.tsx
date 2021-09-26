import * as React from 'react';
import { StatsVisitorsChart } from 'tmw-admin/components/StatisticsPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={StatsVisitorsChart} />;
export default Page;
