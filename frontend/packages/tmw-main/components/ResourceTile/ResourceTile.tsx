import classNames from 'classnames';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { ResourcePricingPill } from 'tmw-main/components/ResourcePricingPill';
import { RESOURCES_BASE_URL, VIEWPORT_BREAKPOINTS } from 'tmw-main/constants/app-constants';
import { useViewport } from 'tmw-common/components/ViewportProvider';
import { ArrowRightIcon } from 'tmw-main/icons/ArrowRightIcon';
import { ajaxGet } from 'tmw-common/utils/ajax';
import { Resource } from 'tmw-main/constants/app-types';
import heartIcon from 'tmw-main/assets/images/heart.svg';
import heartFullIcon from 'tmw-main/assets/images/heart-full.svg';
import defaultResourceImage from 'tmw-main/assets/images/default-resource-img.svg';

import styles from './ResourceTile.module.scss';

interface ResourceTileProps {
    resource: Resource;
}

export const ResourceTile: React.FunctionComponent<ResourceTileProps> = ({ resource }) => {
    const { width } = useViewport();
    const isMobileViewport = width < VIEWPORT_BREAKPOINTS.MOBILE;

    const [cookies, setCookie] = useCookies([resource.id]);
    const isLiked = cookies[resource.id] === 'true';

    const [isImageLinkBroken, setIsImageLinkBroken] = React.useState<boolean>(false);

    const likeResource = async (): Promise<void> => {
        if (isLiked) {
            setCookie(resource.id, 'false', { path: '/' });
            await ajaxGet(`resources/like/remove/${resource.id}`);
        } else {
            setCookie(resource.id, 'true', { path: '/' });
            await ajaxGet(`resources/like/add/${resource.id}`);
        }
    };

    const visitWebsite = async (resourceId: string): Promise<void> => {
        await ajaxGet(`resources/visit/${resourceId}`);
    };

    const iconUrl =
        resource.iconFilename && !isImageLinkBroken
            ? RESOURCES_BASE_URL + resource.id
            : defaultResourceImage;

    const onImageLoadingFailed = (): void => {
        if (!isImageLinkBroken) {
            setIsImageLinkBroken(true);
        }
    };

    return (
        <div className={styles.resourceTile}>
            <div className={styles.container}>
                {!isMobileViewport ? (
                    <div className={styles.header}>
                        <span className={classNames(styles.headerDot, styles.headerDotRed)} />
                        <span className={classNames(styles.headerDot, styles.headerDotYellow)} />
                        <span className={classNames(styles.headerDot, styles.headerDotGreen)} />
                    </div>
                ) : null}
                <img
                    src={iconUrl}
                    alt={resource.name}
                    className={styles.icon}
                    onError={onImageLoadingFailed}
                />
                <div className={styles.content}>
                    <div className={styles.titleFloatRight}>
                        <ResourcePricingPill pricing={resource.pricing} />
                        <span className={styles.likeResourceButton}>
                            <img
                                src={isLiked ? heartFullIcon : heartIcon}
                                alt={isLiked ? 'Unlike' : 'Like'}
                                height="15px"
                                onClick={likeResource}
                            />
                        </span>
                    </div>
                    <p className={styles.title}>{resource.name}</p>
                    <p className={styles.description}>{resource.description}</p>
                </div>
            </div>
            <a
                href={resource.url}
                onClick={(): Promise<void> => visitWebsite(resource.id)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.visitResourceButton}
            >
                Open website
                <span className={styles.visitResourceButtonIcon}>
                    <ArrowRightIcon fill="#434343" />
                </span>
            </a>
        </div>
    );
};
