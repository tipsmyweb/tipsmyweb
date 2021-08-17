import { useRouter } from 'next/router';
import * as React from 'react';
import { LoadingSpinner } from 'tmw-main/components/LoadingSpinner';
import { TagsLaunchBar } from 'tmw-main/components/TagsLaunchBar';
import { MAIN_APP_ROUTES, SIZES } from 'tmw-main/constants/app-constants';
import { ArrowLeftIcon } from 'tmw-main/icons/ArrowLeftIcon';
import { serializeMainTagsFromAPI } from 'tmw-main/utils/api-serialize';
import { MainTag, RelatedTag } from 'tmw-main/constants/app-types';
import { ajaxGet } from 'tmw-common/utils/ajax';
import { Tag } from 'tmw-main/components/Tag';
import { encodeSearchTags } from 'tmw-main/utils/tags-search-url';

import styles from './TagsSelector.module.scss';

export const TagsSelector: React.FunctionComponent = () => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [tags, setTags] = React.useState<MainTag[]>([]);
    const [selectedRelatedTags, setSelectedRelatedTags] = React.useState<RelatedTag[]>([]);
    const [selectedMainTag, setSelectedMainTag] = React.useState<MainTag>();

    const router = useRouter();

    const preselectTags = (tags: MainTag[]): void => {
        const { main: mainSlugTag, related: relatedSlugTag } = router.query;
        if (mainSlugTag != null) {
            const mainTag = tags.find(t => t.primary && t.slug == mainSlugTag);
            if (mainTag != null) {
                setSelectedMainTag(mainTag);
                const relatedTag = mainTag.relatedTags.find(t => t.slug == relatedSlugTag);
                if (relatedTag != null) {
                    setSelectedRelatedTags([relatedTag]);
                }
            }
        }
    };

    const fetchTagOptions = (): Promise<void> => {
        return ajaxGet('main/tags')
            .then(res => {
                const newTags = serializeMainTagsFromAPI(res.data || []);
                setTags(newTags);
                preselectTags(newTags);
            })
            .catch(() => {
                // TODO: Handle errors / no tags
            });
    };

    const addRelatedTag = (selectedTag: RelatedTag): void => {
        setSelectedRelatedTags(selectedRelatedTags.concat([selectedTag]));
    };

    const removeRelatedTag = (selectedTag: RelatedTag): void => {
        setSelectedRelatedTags(selectedRelatedTags.filter(tag => tag.id !== selectedTag.id));
    };

    const onRelatedTagClick = (selectedTag: RelatedTag): void => {
        const index = selectedRelatedTags.map(tag => tag.id).indexOf(selectedTag.id);
        if (index === -1) {
            addRelatedTag(selectedTag);
        } else {
            removeRelatedTag(selectedTag);
        }
    };

    const onMainTagClick = (selectedTag: MainTag): void => {
        if (selectedMainTag) {
            setSelectedMainTag(undefined);
            setSelectedRelatedTags([]);
        } else {
            setSelectedMainTag(selectedTag);
        }
    };

    React.useEffect(() => {
        if (selectedMainTag && selectedMainTag.relatedTags.length === 0) {
            launchSearch();
        }
    }, [selectedMainTag]);

    const launchSearch = (): void => {
        if (selectedMainTag) {
            const selectedTags = [selectedMainTag, ...selectedRelatedTags];
            const selectedTagSlugs = selectedTags.map(tag => tag.slug);
            const searchRoute = MAIN_APP_ROUTES.RESULTS.replace(
                ':searchTags',
                encodeSearchTags(selectedTagSlugs),
            );
            router.push(searchRoute);
        }
    };

    React.useEffect(() => {
        if (!router.isReady) return;

        fetchTagOptions().then(() => {
            setIsLoading(false);
        });
    }, [router.isReady]);

    React.useEffect(() => {
        const handleRouteChange = (url: string) => {
            if (url != null && url.includes('new')) {
                setSelectedMainTag(undefined);
                setSelectedRelatedTags([]);
            }
        };
        router.events.on('routeChangeStart', handleRouteChange);
    }, []);

    let barPercentage = 0;
    barPercentage += selectedMainTag ? 20 : 0;
    barPercentage += selectedRelatedTags.length * 20;

    // Compute the number of resources reached with these selected tags
    const totalResources =
        selectedRelatedTags.length > 0
            ? selectedRelatedTags.reduce((sum, tag) => sum + tag.weight, 0)
            : selectedMainTag
            ? selectedMainTag.weight
            : 0;

    return (
        <div>
            <TagsLaunchBar
                onClickCallback={launchSearch}
                completionPercentage={barPercentage}
                totalResources={totalResources}
            />
            {isLoading ? (
                <div className={styles.loadingSpinner}>
                    <LoadingSpinner />
                    <br />
                    Loading Tags
                </div>
            ) : (
                <div className={styles.container}>
                    {selectedMainTag && (
                        <div className={styles.selectedPrimaryTag}>
                            <span
                                className={styles.selectedPrimaryTagArrow}
                                onClick={(): void => onMainTagClick(selectedMainTag)}
                            >
                                <ArrowLeftIcon width={20} />
                            </span>
                            <Tag
                                content={selectedMainTag.name}
                                isSelected={false}
                                size={SIZES.LARGE}
                                clickable={false}
                            />
                        </div>
                    )}
                    <div className={styles.tagOptions}>
                        {selectedMainTag
                            ? selectedMainTag.relatedTags.map((tag: RelatedTag) => (
                                  <Tag
                                      key={tag.id}
                                      content={tag.name}
                                      isSelected={selectedRelatedTags
                                          .map(tag => tag.id)
                                          .includes(tag.id)}
                                      onClickCallback={(): void => onRelatedTagClick(tag)}
                                      size={SIZES.MEDIUM}
                                  />
                              ))
                            : tags
                                  .filter(tag => tag.primary)
                                  .map(tag => {
                                      return (
                                          <Tag
                                              key={tag.id}
                                              content={tag.name}
                                              isSelected={false}
                                              onClickCallback={(): void => onMainTagClick(tag)}
                                              size={SIZES.MEDIUM}
                                          />
                                      );
                                  })}
                    </div>
                </div>
            )}
        </div>
    );
};
