import * as React from 'react';
import { LogsPage } from 'tmw-admin/components/LogsPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={LogsPage} />;
export default Page;
