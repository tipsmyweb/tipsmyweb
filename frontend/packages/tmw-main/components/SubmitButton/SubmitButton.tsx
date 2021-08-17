import * as React from 'react';
import classNames from 'classnames';

import styles from './SubmitButton.module.scss';
import { TickIcon } from 'tmw-main/icons/TickIcon';

interface SubmitButtonProps {
    onClick?: () => void;
    isValid?: boolean;
    isPending?: boolean;
    finishedLabel: string;
    finishedAction: () => void;
}

export const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({
    onClick,
    isValid,
    isPending,
    finishedLabel,
    finishedAction,
}) => {
    const [isFinished, setIsFinished] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (isValid) {
            setTimeout(() => {
                setIsFinished(true);
            }, 2000);
        }
    }, [isValid]);

    const buttonLabel = isFinished ? finishedLabel : isValid ? <TickIcon width={16} /> : 'SUBMIT';

    return (
        <div
            className={classNames(styles.submitButton, {
                [styles.waiting]: !isPending && !isValid,
                [styles.pending]: isPending,
                [styles.valid]: !isPending && isValid,
                [styles.finished]: isFinished,
            })}
            onClick={isValid || isPending ? undefined : onClick}
        >
            <span className={styles.text} onClick={isFinished ? finishedAction : undefined}>
                {buttonLabel}
            </span>
        </div>
    );
};
