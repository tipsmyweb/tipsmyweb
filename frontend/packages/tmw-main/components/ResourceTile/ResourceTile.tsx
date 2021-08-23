import classNames from 'classnames';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { ResourcePricingPill } from 'tmw-main/components/ResourcePricingPill';
import { RESOURCES_BASE_URL, VIEWPORT_BREAKPOINTS } from 'tmw-main/constants/app-constants';
import { useViewport } from 'tmw-common/components/ViewportProvider';
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

    const likeResource = async (e: React.MouseEvent<HTMLImageElement>): Promise<void> => {
        e.stopPropagation();
        if (isLiked) {
            setCookie(resource.id, 'false', { path: '/' });
            await ajaxGet(`resources/like/remove/${resource.id}`);
        } else {
            setCookie(resource.id, 'true', { path: '/' });
            await ajaxGet(`resources/like/add/${resource.id}`);
        }
    };

    const visitWebsite = async (): Promise<void> => {
        window.open(resource.url, '_blank');
        await ajaxGet(`resources/visit/${resource.id}`);
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
        <div className={styles.resourceTile} onClick={visitWebsite}>
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
                    <div className={styles.contentHeader}>
                        <p className={styles.title}>{resource.name}</p>
                        <div className={styles.contentHeaderRight}>
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
                    </div>
                    <p className={styles.description}>{resource.description}</p>
                </div>
            </div>
        </div>
    );
};
