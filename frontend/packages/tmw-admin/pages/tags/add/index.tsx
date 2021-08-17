import * as React from 'react';
import { TagsEditPage } from 'tmw-admin/components/TagsEditPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={TagsEditPage} />;
export default Page;
