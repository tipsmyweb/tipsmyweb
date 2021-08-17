import * as React from 'react';
import Link from 'next/link';
import { Button, Icon } from 'semantic-ui-react';

interface FormFooterProps {
    backButtonURL?: string;
    isSubmitDisabled: boolean;
    onSubmitClick: () => void;
    buttonValue?: string;
}

export const FormFooter: React.FunctionComponent<FormFooterProps> = ({
    backButtonURL,
    isSubmitDisabled,
    onSubmitClick,
    buttonValue = 'Submit',
}) => (
    <div style={backButtonURL ? undefined : { textAlign: 'right' }}>
        {/*
         * Fix for footers without a back button: the whole div is set to align
         * text to right (the floated-right button doesn't work if it's alone
         * in the div).
         */}
        {backButtonURL ? (
            <Link href={backButtonURL}>
                <Button icon labelPosition="left">
                    <Icon name="arrow left" />
                    Back
                </Button>
            </Link>
        ) : null}
        <Button
            icon
            labelPosition="right"
            color="blue"
            onClick={onSubmitClick}
            disabled={isSubmitDisabled}
            floated={backButtonURL ? 'right' : undefined}
        >
            {buttonValue}
            <Icon name="upload" />
        </Button>
    </div>
);
