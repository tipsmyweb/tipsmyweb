import * as React from 'react';
import { ResourcesEditPage } from 'tmw-admin/components/ResourcesEditPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={ResourcesEditPage} />;
export default Page;
