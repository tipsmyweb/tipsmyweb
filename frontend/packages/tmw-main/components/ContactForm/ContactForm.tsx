import * as React from 'react';
import { ajaxPost } from 'tmw-common/utils/ajax';
import { InputField } from 'tmw-main/components/InputField';
import { SubmitButton } from 'tmw-main/components/SubmitButton';
import { VALIDATION } from 'tmw-main/constants/app-constants';
import { isValidEmail } from 'tmw-main/utils/form-validation';

import styles from './ContactForm.module.scss';

const getContactValidationMessages = (
    email: string,
    message: string,
): { email: string; message: string } => {
    const validationMessages = {
        email: '',
        message: '',
    };

    if (!email) {
        validationMessages.email = 'You need to provide an email address here';
    } else if (!isValidEmail(email)) {
        validationMessages.email = 'The provided email address is not valid';
    } else if (email.length > VALIDATION.EMAIL_MAX_LENGTH) {
        validationMessages.email = `Your email can't be longer than ${VALIDATION.EMAIL_MAX_LENGTH} characters`;
    }

    if (!message) {
        validationMessages.message = 'Your message is empty!';
    } else if (message.length > VALIDATION.MESSAGE_MAX_LENGTH) {
        validationMessages.message = `Your message can't be longer than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`;
    }

    return validationMessages;
};

interface ContactFormProps {
    finishedAction: () => void;
    finishedLabel: string;
}

export const ContactForm: React.FunctionComponent<ContactFormProps> = ({
    finishedAction,
    finishedLabel,
}) => {
    const [emailInputValue, setEmailInputValue] = React.useState<string>('');
    const [messageInputValue, setMessageInputValue] = React.useState<string>('');
    const [emailValidationMessage, setEmailValidationMessage] = React.useState<string>('');
    const [messageValidationMessage, setMessageValidationMessage] = React.useState<string>('');

    const [hasSubmitError, setHasSubmitError] = React.useState<boolean>(false);
    const [hasSubmitSuccess, setHasSubmitSuccess] = React.useState<boolean>(false);
    const [isSubmitPending, setIsSubmitPending] = React.useState<boolean>(false);

    const handleEmailInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const { value } = event.target;
        setEmailInputValue(value);
    };

    const handleMessageInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
        const { value } = event.target;
        setMessageInputValue(value);
    };

    const submitContactForm = async (): Promise<void> => {
        const validationMessages = getContactValidationMessages(emailInputValue, messageInputValue);
        const isFormValid = !validationMessages.email && !validationMessages.message;
        setEmailValidationMessage(validationMessages.email);
        setMessageValidationMessage(validationMessages.message);

        if (isFormValid) {
            const payload = {
                email: emailInputValue,
                message: messageInputValue,
            };

            setIsSubmitPending(true);
            ajaxPost('contacts', payload)
                .then(() => {
                    setHasSubmitSuccess(true);
                    setHasSubmitError(false);
                })
                .catch(error => {
                    // Additional error messages from backend validation (shouldn't happen)
                    const errorMessages = error.response?.data?.errors;
                    setEmailValidationMessage(errorMessages?.email || '');
                    setMessageValidationMessage(errorMessages?.message || '');
                    if (!errorMessages?.email && !errorMessages?.message) {
                        // Show error message when it's not a validation error
                        setHasSubmitError(true);
                    }
                })
                .finally(() => {
                    setIsSubmitPending(false);
                });
        }
    };

    return (
        <div className={styles.contactForm}>
            <div className={styles.title}>Contact</div>
            <div className={styles.subtitle}>
                {!hasSubmitSuccess
                    ? 'Give us your feedback!'
                    : 'Your message was successfully submitted'}
            </div>
            <div className={styles.body}>
                <form autoComplete="off">
                    <InputField
                        className={styles.emailInput}
                        type="email"
                        placeholder="Your email"
                        name="email-input"
                        value={emailInputValue}
                        isRequired
                        onChange={handleEmailInputChange as (event: React.ChangeEvent) => void}
                        validationMessage={emailValidationMessage}
                        isInvalid={emailValidationMessage.length > 0}
                        isDisabled={isSubmitPending || hasSubmitSuccess}
                    />
                    <InputField
                        type="textarea"
                        className={styles.messageInput}
                        placeholder="Tell us what you think"
                        name="messageInput"
                        value={messageInputValue}
                        isRequired
                        onChange={handleMessageInputChange as (event: React.ChangeEvent) => void}
                        validationMessage={messageValidationMessage}
                        isInvalid={messageValidationMessage.length > 0}
                        isDisabled={isSubmitPending || hasSubmitSuccess}
                        charactersCounter={VALIDATION.MESSAGE_MAX_LENGTH}
                    />
                </form>
            </div>
            <div className={styles.buttons}>
                <SubmitButton
                    onClick={submitContactForm}
                    isValid={hasSubmitSuccess}
                    isPending={isSubmitPending}
                    finishedLabel={finishedLabel}
                    finishedAction={finishedAction}
                />
            </div>
            {hasSubmitError ? (
                <div className={styles.submitError}>
                    We&apos;re having trouble submitting your message, please try again!
                </div>
            ) : null}
        </div>
    );
};
