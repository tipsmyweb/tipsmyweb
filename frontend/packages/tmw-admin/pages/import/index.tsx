import * as React from 'react';
import { BatchImportPage } from 'tmw-admin/components/BatchImportPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={BatchImportPage} />;
export default Page;
