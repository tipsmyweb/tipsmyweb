import * as React from 'react';
import { ContactPage } from 'tmw-admin/components/ContactPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={ContactPage} />;
export default Page;
