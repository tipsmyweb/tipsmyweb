import * as React from 'react';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import styles from './ToastMessage.module.scss';

interface ToastMessageProps {
    message: string;
    isOpen: boolean;
}

export const ToastMessage: React.FunctionComponent<ToastMessageProps> = ({ message, isOpen }) => {
    return (
        <div className={classNames(styles.toastMessage, { [styles.open]: isOpen })}>{message}</div>
    );
};

export const ToastMessageWithPortal: React.FunctionComponent<ToastMessageProps> = ({
    message,
    isOpen,
}) => {
    return createPortal(<ToastMessage message={message} isOpen={isOpen} />, document?.body);
};
