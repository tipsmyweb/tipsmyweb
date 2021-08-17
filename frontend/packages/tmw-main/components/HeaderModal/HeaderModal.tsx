import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';

import styles from './HeaderModal.module.scss';

interface HeaderModalProps {
    children: (closeModalAction: () => void) => React.ReactNode;
    target: React.ReactNode;
}

export const HeaderModal: React.FunctionComponent<HeaderModalProps> = ({ children, target }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const toggleIsOpen = (): void => {
        setIsOpen(!isOpen);
    };

    const modalRef = React.useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent): void => {
        // NOTE: 'as Node' is a hacky workaround as TS can't infer that event.target is necessarily a Node here.
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    React.useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    return (
        <Manager>
            <Reference>
                {({ ref }): React.ReactNode => (
                    <span ref={ref} onClick={toggleIsOpen}>
                        {target}
                    </span>
                )}
            </Reference>
            {isOpen ? (
                <Popper
                    placement="bottom"
                    modifiers={[{ name: 'preventOverflow', options: { padding: 80 } }]}
                >
                    {({ ref, style, placement, arrowProps }): React.ReactNode => (
                        <div
                            ref={ref}
                            style={style}
                            data-placement={placement}
                            className={styles.headerModal}
                        >
                            <div ref={modalRef} className={styles.container}>
                                {children((): void => setIsOpen(false))}
                            </div>
                            <div
                                ref={arrowProps.ref}
                                style={arrowProps.style}
                                className={styles.arrow}
                            />
                        </div>
                    )}
                </Popper>
            ) : null}
        </Manager>
    );
};
