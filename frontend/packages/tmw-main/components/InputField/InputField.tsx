import * as React from 'react';
import classNames from 'classnames';

import styles from './InputField.module.scss';

interface InputFieldProps {
    type: 'text' | 'number' | 'email' | 'textarea';
    name: string;
    value: string;
    isRequired?: boolean;
    placeholder?: string;
    onChange?: (event: React.ChangeEvent) => void;
    className?: string;
    isFullWidth?: boolean;
    isInvalid?: boolean;
    validationMessage?: string;
    isDisabled?: boolean;
    charactersCounter?: number;
}

export const InputField: React.FunctionComponent<InputFieldProps> = ({
    type,
    name,
    value,
    isRequired = false,
    placeholder,
    onChange,
    className,
    isFullWidth = true,
    isInvalid,
    validationMessage,
    isDisabled = false,
    charactersCounter,
}) => {
    const isTextarea = type === 'textarea';
    const finalClassName = classNames(styles.inputField, className, {
        [styles.textarea]: isTextarea,
        [styles.input]: !isTextarea,
        [styles.fullWidth]: isFullWidth,
        [styles.invalid]: isInvalid,
        [styles.disabled]: isDisabled,
    });

    return (
        <div className={styles.inputField}>
            {isTextarea ? (
                <textarea
                    className={finalClassName}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    required={isRequired}
                    onChange={onChange}
                    disabled={isDisabled}
                />
            ) : (
                <input
                    className={finalClassName}
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    value={value}
                    required={isRequired}
                    onChange={onChange}
                    disabled={isDisabled}
                />
            )}
            {validationMessage || charactersCounter ? (
                <div className={styles.validation}>
                    {validationMessage ? (
                        <div className={styles.validationMessage}>{validationMessage}</div>
                    ) : null}
                    {charactersCounter !== undefined && value.length > 0 ? (
                        <div
                            className={classNames(styles.charactersCounter, {
                                [styles.charactersCounterError]: value.length > charactersCounter,
                            })}
                        >
                            {value.length}/{charactersCounter}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};
