import * as React from 'react';
import { PricesPage } from 'tmw-admin/components/PricesPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={PricesPage} />;
export default Page;
