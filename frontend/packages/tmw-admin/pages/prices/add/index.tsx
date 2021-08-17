import * as React from 'react';
import { PricesEditPage } from 'tmw-admin/components/PricesEditPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
const Page: React.FunctionComponent = () => <ProtectedPage component={PricesEditPage} />;
export default Page;
