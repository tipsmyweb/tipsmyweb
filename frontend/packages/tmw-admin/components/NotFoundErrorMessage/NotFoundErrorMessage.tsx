import * as React from 'react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';

export const NotFoundErrorMessage: React.FunctionComponent = () => (
    <ActionMessage
        messageHeader="Page not found"
        message="This page probably doesn't exist!"
        type="warning"
    />
);
