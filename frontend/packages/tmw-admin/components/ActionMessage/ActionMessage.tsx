import * as React from 'react';
import { Message } from 'semantic-ui-react';

interface ActionMessageProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    messageHeader?: string;
}

export const ActionMessage: React.FunctionComponent<ActionMessageProps> = ({
    message,
    type,
    messageHeader,
}) => {
    let iconName;
    let header;

    switch (type) {
        case 'success':
            iconName = 'check circle outline';
            header = 'Success!';
            break;
        case 'error':
            iconName = 'warning circle';
            header = 'Something wrong happened...';
            break;
        case 'warning':
            iconName = 'warning sign';
            header = 'Warning!';
            break;
        case 'info':
            iconName = 'info';
            header = 'Information!';
            break;
        default:
            iconName = 'warning';
            header = 'Message';
            break;
    }

    if (message && message.length > 0) {
        return (
            <Message
                negative={type === 'error'}
                positive={type === 'success'}
                warning={type === 'warning'}
                info={type === 'info'}
                icon={iconName}
                header={messageHeader || header}
                content={message}
            />
        );
    }

    return null;
};
