import * as React from 'react';
import { ResourceTypesEditPage } from 'tmw-admin/components/ResourceTypesEditPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={ResourceTypesEditPage} />;
export default Page;
