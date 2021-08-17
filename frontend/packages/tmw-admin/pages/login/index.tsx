import * as React from 'react';
import { LoginPage } from 'tmw-admin/components/LoginPage';
import { ProtectedPage } from 'tmw-admin/components/ProtectedPage';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
const Page: React.FunctionComponent = () => (
    <ProtectedPage
        component={LoginPage}
        shouldBeLoggedOut={true}
        redirection={ADMIN_APP_ROUTES.MAIN}
    />
);
export default Page;
