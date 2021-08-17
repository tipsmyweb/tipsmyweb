import * as React from 'react';
import { SuggestionsPage } from 'tmw-admin/components/SuggestionsPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={SuggestionsPage} />;
export default Page;
