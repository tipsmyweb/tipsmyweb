import classNames from 'classnames';
import * as React from 'react';
import { ResourceTile } from 'tmw-main/components/ResourceTile';
import { ResourceTilePlaceholder } from 'tmw-main/components/ResourceTilePlaceholder';
import { Resource } from 'tmw-main/constants/app-types';
import { useViewport } from 'tmw-common/components/ViewportProvider';
import { VIEWPORT_BREAKPOINTS } from 'tmw-main/constants/app-constants';
import chevronDownIcon from 'tmw-main/assets/images/chevron-down.svg';

import styles from './SearchResultsList.module.scss';

interface SearchResultsListProps {
    resultsList: Resource[];
    isLoading: boolean;
}
export const SearchResultsList: React.FunctionComponent<SearchResultsListProps> = ({
    resultsList,
    isLoading,
}) => {
    const { width } = useViewport();
    const isMobileViewport = width < VIEWPORT_BREAKPOINTS.MOBILE;

    const resultsListElement = React.useRef<HTMLDivElement>(null);
    const [scrollLeftPosition, setScrollLeftPosition] = React.useState(0);
    const [scrollRightPosition, setScrollRightPosition] = React.useState(0);

    const onResultsListScroll = (e: React.UIEvent<HTMLDivElement>): void => {
        const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
        setScrollLeftPosition(scrollLeft);
        setScrollRightPosition(scrollWidth - clientWidth - scrollLeft - 1);
    };

    const onResultsListWheel = (e: WheelEvent): void => {
        const { deltaY } = e;
        if (deltaY) {
            resultsListElement?.current?.scrollBy({ left: deltaY });
            e.preventDefault(); // We don't want the page to also scroll
        }
    };

    const onRightArrowClick = (): void => {
        resultsListElement?.current?.scrollBy({ left: 360, behavior: 'smooth' });
    };

    const onLeftArrowClick = (): void => {
        resultsListElement?.current?.scrollBy({ left: -360, behavior: 'smooth' });
    };

    const showLeftArrow = scrollLeftPosition > 0;
    const showRightArrow = scrollRightPosition > 0;

    React.useEffect(() => {
        // Set initial value for scrollRightPosition
        const scrollWidth = resultsListElement?.current?.scrollWidth || 0;
        const clientWidth = resultsListElement?.current?.clientWidth || 0;
        setScrollRightPosition(scrollWidth - clientWidth);

        /*
         * There is a change in Chrome 73+ that makes wheel events passive by default,
         * which also prevents calls to 'preventDefault()'. Therefore, we need to pass the
         * option 'passive: false' but that's not possible for now with React's API so
         * we must do it in Vanilla JS until the API changes.
         */

        // Override wheel events to scroll horizontally on results list
        resultsListElement?.current?.addEventListener('wheel', onResultsListWheel, {
            passive: false,
        });
    }, [isLoading]);

    return (
        <div>
            {!isMobileViewport && !isLoading ? (
                <>
                    {showLeftArrow ? (
                        <div className={classNames(styles.scrollArrow, styles.scrollArrowLeft)}>
                            <img
                                src={chevronDownIcon.src}
                                alt="Scroll left"
                                className={styles.scrollArrowLeftIcon}
                                onClick={onLeftArrowClick}
                            />
                        </div>
                    ) : null}

                    {showRightArrow ? (
                        <div className={classNames(styles.scrollArrow, styles.scrollArrowRight)}>
                            <img
                                src={chevronDownIcon.src}
                                alt="Scroll right"
                                className={styles.scrollArrowRightIcon}
                                onClick={onRightArrowClick}
                            />
                        </div>
                    ) : null}
                </>
            ) : null}
            <div
                ref={resultsListElement}
                onScroll={onResultsListScroll}
                className={styles.resultsList}
            >
                {isLoading ? (
                    <>
                        <ResourceTilePlaceholder />
                        <ResourceTilePlaceholder />
                        <ResourceTilePlaceholder />
                        <ResourceTilePlaceholder />
                    </>
                ) : (
                    resultsList.map(resource => (
                        <ResourceTile key={resource.id} resource={resource} />
                    ))
                )}
            </div>
        </div>
    );
};
