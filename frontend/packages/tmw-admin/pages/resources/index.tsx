import * as React from 'react';
import { ResourcesPage } from 'tmw-admin/components/ResourcesPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={ResourcesPage} />;
export default Page;
