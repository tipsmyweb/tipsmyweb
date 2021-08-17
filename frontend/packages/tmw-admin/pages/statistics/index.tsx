import * as React from 'react';
import { StatisticsPage } from 'tmw-admin/components/StatisticsPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={StatisticsPage} />;
export default Page;
