import * as React from 'react';
import { TagsPage } from 'tmw-admin/components/TagsPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={TagsPage} />;
export default Page;
