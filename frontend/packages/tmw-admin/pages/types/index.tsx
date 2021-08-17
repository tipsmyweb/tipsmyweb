import * as React from 'react';
import { ResourceTypesPage } from 'tmw-admin/components/ResourceTypesPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={ResourceTypesPage} />;
export default Page;
