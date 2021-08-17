import * as React from 'react';
import { copyTextToClipboard } from 'tmw-common/utils/copy-text-to-clipboard';
import { Button, ButtonVariant } from 'tmw-main/components/Button';
import { ButtonProps } from 'tmw-main/components/Button/Button';
import { useToastMessageContext } from 'tmw-main/components/ToastMessage';
import { CopyIcon } from 'tmw-main/icons/CopyIcon';

interface ShareButtonProps {
    className?: ButtonProps['className'];
    size?: ButtonProps['size'];
}

export const ShareButton: React.FunctionComponent<ShareButtonProps> = ({ className, size }) => {
    const { openToastMessage } = useToastMessageContext();

    const onButtonClick = (): void => {
        copyTextToClipboard(window.location.href);
        openToastMessage('URL was successfully copied in clipboard !');
    };

    return (
        <Button
            className={className}
            size={size}
            content="Share"
            variant={ButtonVariant.WHITE_TEXT_BLACK}
            onClick={onButtonClick}
            icon={CopyIcon}
        />
    );
};
