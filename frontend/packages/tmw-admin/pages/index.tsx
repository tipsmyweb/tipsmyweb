import * as React from 'react';
import { OverviewPage } from 'tmw-admin/components/OverviewPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={OverviewPage} />;
export default Page;
