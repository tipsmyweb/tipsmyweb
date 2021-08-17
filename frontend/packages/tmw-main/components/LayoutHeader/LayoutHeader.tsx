import * as React from 'react';
import Link from 'next/link';
import { ContactForm } from 'tmw-main/components/ContactForm';
import { HeaderModal } from 'tmw-main/components/HeaderModal';
import { SuggestionForm } from 'tmw-main/components/SuggestionForm';
import { MAIN_APP_ROUTES, VIEWPORT_BREAKPOINTS } from 'tmw-main/constants/app-constants';
import { useViewport } from 'tmw-common/components/ViewportProvider';
import { MagnifyingGlassIcon } from 'tmw-main/icons/MagnifyingGlassIcon';
import logo from 'tmw-common/images/logo.svg';

import styles from './LayoutHeader.module.scss';

export const LayoutHeader: React.FunctionComponent = () => {
    const { width } = useViewport();
    const isMobileViewport = width < VIEWPORT_BREAKPOINTS.MOBILE;

    const newSearchLink = `${MAIN_APP_ROUTES.HOME}?new=1`;

    const links = [
        {
            id: 'new-search',
            title: 'New search',
            icon: <MagnifyingGlassIcon />,
            link: newSearchLink,
        },
        {
            id: 'share-website',
            title: 'Share a website',
            modalContent: !isMobileViewport ? SuggestionForm : null,
            link: isMobileViewport ? MAIN_APP_ROUTES.SUGGESTION : null,
        },
        {
            id: 'contact',
            title: 'Contact',
            modalContent: !isMobileViewport ? ContactForm : null,
            link: isMobileViewport ? MAIN_APP_ROUTES.CONTACT : null,
        },
    ];

    return (
        <div className={styles.layoutHeader}>
            {!isMobileViewport ? (
                <Link href={newSearchLink}>
                    <img src={logo} alt="logo" className={styles.logo} />
                </Link>
            ) : (
                <p className={styles.logoName}>
                    <Link href={MAIN_APP_ROUTES.HOME}>
                        <a>
                            <img src={logo} alt="logo" className={styles.logo} />
                            TipsMyWeb
                        </a>
                    </Link>
                </p>
            )}
            <div className={styles.links}>
                {links.map(({ title, modalContent: ModalContent, link, id, icon }) => {
                    const linkItem = (
                        <>
                            {icon ? <span className={styles.linkIcon}>{icon}</span> : null}
                            <span className={styles.underlineEffect}>{title}</span>
                        </>
                    );

                    if (ModalContent) {
                        return (
                            <HeaderModal
                                key={id}
                                target={<a className={styles.link}>{linkItem}</a>}
                            >
                                {(closeModalAction): React.ReactNode => (
                                    <ModalContent
                                        finishedAction={closeModalAction}
                                        finishedLabel="CLOSE"
                                    />
                                )}
                            </HeaderModal>
                        );
                    } else if (link) {
                        return (
                            <Link key={id} href={link}>
                                <a className={styles.link}>{linkItem}</a>
                            </Link>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};
