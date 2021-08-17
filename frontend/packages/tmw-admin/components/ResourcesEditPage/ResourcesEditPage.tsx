import { useRouter } from 'next/router';
import * as React from 'react';
import {
    Form,
    Header,
    Icon,
    Message,
    Segment,
    TextArea,
    Grid,
    Image,
    Label,
    TextAreaProps,
    DropdownProps,
} from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { FormFooter } from 'tmw-admin/components/FormFooter';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES, LOCALES, LOCALES_NAMES } from 'tmw-admin/constants/app-constants';
import { Resource, TagsMap } from 'tmw-admin/constants/app-types';
import {
    serializePricesFromAPI,
    serializeResourceFromAPI,
    serializeResourceToAPI,
    serializeResourceTypesFromAPI,
    serializeTagsFromAPI,
} from 'tmw-admin/utils/api-serialize';
import { convertToSelectOptions, InputSelectOption } from 'tmw-admin/utils/select-options';
import { buildTagsMap } from 'tmw-admin/utils/tags';
import { ajaxGet, ajaxPost, ajaxPostImage, ajaxPut } from 'tmw-common/utils/ajax';

const localNameOptions: InputSelectOption[] = Object.values(LOCALES).map(locale => ({
    key: locale,
    value: locale,
    text: LOCALES_NAMES[locale],
}));

export const ResourcesEditPage: React.FunctionComponent = () => {
    const [resource, setResource] = React.useState<Partial<Resource>>({});
    const [resourceImageTempURL, setResourceImageTempURL] = React.useState<string>('');
    const [resourceImageFile, setResourceImageFile] = React.useState<File>();

    const [pricesOptions, setPricesOptions] = React.useState<InputSelectOption[]>([]);
    const [typesOptions, setTypesOptions] = React.useState<InputSelectOption[]>([]);
    const [tagOptions, setTagOptions] = React.useState<InputSelectOption[]>([]);
    const [tagsMap, setTagsMap] = React.useState<TagsMap>({});

    const isReadyToSubmit =
        resource.name &&
        resource.url &&
        resource.description &&
        resource.typeId &&
        resource.priceId &&
        resource.score &&
        resource.interfaceScore &&
        resource.locale;

    const [canEdit, setCanEdit] = React.useState<boolean>(true);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');

    const router = useRouter();
    const { id: editedResourceId } = router.query;

    const fetchResource = async (): Promise<void> => {
        return ajaxGet(`resources/${editedResourceId}`)
            .then(res => {
                const resource = serializeResourceFromAPI(res.data);
                setResource(resource);
            })
            .catch(() => {
                setErrorMessage('Error while fetching resource from the API.');
                setCanEdit(false);
            });
    };

    const fetchPricesOptions = async (): Promise<void> => {
        return ajaxGet('prices')
            .then(res => {
                const prices = serializePricesFromAPI(res.data);
                setPricesOptions(convertToSelectOptions(prices, 'id', 'name'));

                if (prices.length == 0) {
                    setErrorMessage(
                        'There are no pricing options available yet. Add some first before editing/adding resources!',
                    );
                    setCanEdit(false);
                }
            })
            .catch(() => {
                setErrorMessage('Error while fetching pricing options from the API.');
                setCanEdit(false);
            });
    };

    const fetchTypesOptions = async (): Promise<void> => {
        return ajaxGet('types')
            .then(res => {
                const types = serializeResourceTypesFromAPI(res.data);
                setTypesOptions(convertToSelectOptions(types, 'id', 'name'));

                if (types.length == 0) {
                    setErrorMessage(
                        'There are no resource type options available yet. Add some first before editing/adding resources!',
                    );
                    setCanEdit(false);
                }
            })
            .catch(() => {
                setErrorMessage('Error while fetching types options from the API.');
                setCanEdit(false);
            });
    };

    const fetchTagOptions = async (): Promise<void> => {
        return ajaxGet('tags')
            .then(res => {
                const tags = serializeTagsFromAPI(res.data).filter(tag => !tag.deletedAt);
                setTagOptions(convertToSelectOptions(tags, 'id', 'name'));
                setTagsMap(buildTagsMap(tags));
            })
            .catch(() => {
                setErrorMessage('Error while fetching tag options from the API.');
                setCanEdit(false);
            });
    };

    const onResourceNameInputChange = (_: any, { value }: { value: string }): void => {
        setResource({ ...resource, name: value });
    };

    const onResourceURLInputChange = (_: any, { value }: { value: string }): void => {
        setResource({ ...resource, url: value });
    };

    const onResourceImageInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const file = event.target.files[0];
            setResourceImageTempURL(URL.createObjectURL(file));
            setResourceImageFile(file);
        }
    };

    const onResourceTypeIdInputChange = (
        _: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps,
    ): void => {
        setResource({ ...resource, typeId: data.searchQuery });
    };

    const onResourceLanguageInputChange = (
        _: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps,
    ): void => {
        setResource({ ...resource, locale: data.searchQuery });
    };

    const onResourcePriceIdInputChange = (
        _: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps,
    ): void => {
        setResource({ ...resource, priceId: data.searchQuery });
    };

    const onResourceDescriptionInputChange = (
        _: React.ChangeEvent<HTMLTextAreaElement>,
        data: TextAreaProps,
    ): void => {
        setResource({ ...resource, description: data.value?.toString() });
    };

    const onResourceScoreInputChange = (_: any, { value }: { value: string }): void => {
        setResource({ ...resource, score: parseInt(value) });
    };

    const onResourceInterfaceScoreInputChange = (_: any, { value }: { value: string }): void => {
        setResource({ ...resource, interfaceScore: parseInt(value) });
    };

    const onResourceRenownScoreInputChange = (_: any, { value }: { value: string }): void => {
        setResource({ ...resource, renown: parseInt(value) });
    };

    const addSelectedTag = (tagId: string): void => {
        const newTag = {
            tagId,
            belonging: 5,
            tag: tagsMap[tagId],
        };
        const newTags = resource.tags ? resource.tags.concat([newTag]) : [newTag];
        setResource({ ...resource, tags: newTags });
    };

    const removeSelectedTag = (tagId: string): void => {
        if (resource.tags) {
            const newTags = resource.tags.filter(tag => tag.tagId !== tagId);
            setResource({ ...resource, tags: newTags });
        }
    };

    const incrementSelectedTag = (tagId: string): void => {
        if (resource.tags) {
            const newTags = resource.tags.map(tag => {
                if (tag.tagId === tagId && tag.belonging < 10) {
                    return {
                        ...tag,
                        belonging: tag.belonging + 1,
                    };
                }
                return tag;
            });
            setResource({ ...resource, tags: newTags });
        }
    };

    const decrementSelectedTag = (tagId: string): void => {
        if (resource.tags) {
            const newTags = resource.tags.map(tag => {
                if (tag.tagId === tagId && tag.belonging > 1) {
                    return {
                        ...tag,
                        belonging: tag.belonging - 1,
                    };
                }
                return tag;
            });
            setResource({ ...resource, tags: newTags });
        }
    };

    const saveImage = async (imageFile: File | undefined, resourceId: string): Promise<void> => {
        if (imageFile) {
            const fd = new FormData();
            fd.append('file', imageFile);
            return ajaxPostImage(`resources/image/${resourceId}`, fd);
        }
    };

    const resetForm = (): void => {
        setResource({});
        setResourceImageFile(undefined);
        setResourceImageTempURL('');
    };

    const saveResource = (): void => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        const newResource = serializeResourceToAPI(resource);
        newResource.id = editedResourceId?.toString();

        if (editedResourceId) {
            ajaxPut(`resources/${editedResourceId}`, newResource)
                .then(() => {
                    return saveImage(resourceImageFile, editedResourceId?.toString())
                        .then(() => {
                            setSuccessMessage(
                                'Your resource "' + resource.name + '" was successfully edited.',
                            );
                        })
                        .catch(() => {
                            setErrorMessage(
                                'The resource was successfully edited but there was an error while posting ' +
                                    "the resource's image to the API. The image was probably not saved.",
                            );
                        });
                })
                .catch(() => {
                    setErrorMessage(
                        'Error while updating the resource. Your modifications were probably not saved.',
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            ajaxPost('resources', newResource)
                .then(res => {
                    resetForm();
                    return saveImage(resourceImageFile, res.data.id)
                        .then(() => {
                            setSuccessMessage(
                                'Your resource "' + resource.name + '" was successfully saved.',
                            );
                        })
                        .catch(() => {
                            setErrorMessage(
                                'The resource was successfully edited but there was an error while posting ' +
                                    "the resource's image to the API. The image was probably not saved.",
                            );
                        });
                })
                .catch(() => {
                    setErrorMessage(
                        'Error while posting new resource to API. The new resource was probably not saved.',
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    React.useEffect(() => {
        if (!router.isReady) return;

        const promises: Promise<void>[] = [
            fetchPricesOptions(),
            fetchTypesOptions(),
            fetchTagOptions(),
        ];

        if (editedResourceId != null) promises.push(fetchResource());

        Promise.all(promises).then(() => {
            setIsLoading(false);
        });
    }, [router.isReady]);

    const displayedTagOptions = tagOptions.filter(
        tag =>
            !resource.tags ||
            !resource.tags.map(resourceTag => resourceTag.tagId).includes(tag.key),
    );

    return (
        <div>
            <PageHeader
                iconName="world"
                headerContent={editedResourceId ? 'Edit Resource' : 'Add Resource'}
                subHeaderContent={
                    editedResourceId
                        ? 'Edit an existing resource'
                        : 'Add a resource to be displayed on search results'
                }
            />
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {canEdit ? (
                <>
                    <Message
                        attached
                        header={
                            editedResourceId
                                ? 'Edit an existing resource'
                                : 'Add a resource with tags'
                        }
                        content="The resource will be available as a search result with the tags you set"
                    />
                    <Form className="attached fluid segment" loading={isLoading}>
                        <Form.Group widths="equal">
                            <Form.Input
                                fluid
                                label="Resource Name"
                                placeholder="Resource Name"
                                value={resource.name || ''}
                                onChange={onResourceNameInputChange}
                                required
                            />
                            <Form.Input
                                fluid
                                label="URL"
                                placeholder="URL"
                                value={resource.url || ''}
                                onChange={onResourceURLInputChange}
                                required
                            />
                        </Form.Group>
                        <Grid style={{ marginBottom: 0 }}>
                            <Grid.Row stretched>
                                <Grid.Column width={6}>
                                    {resourceImageTempURL.length ? (
                                        <Segment>
                                            <Image
                                                src={resourceImageTempURL}
                                                size="small"
                                                rounded
                                                centered
                                                piled="false"
                                            />
                                        </Segment>
                                    ) : (
                                        <Segment placeholder style={{ minHeight: '10rem' }}>
                                            <Header as="h4" icon>
                                                <Icon name="file alternate outline" />
                                                No Image
                                            </Header>
                                        </Segment>
                                    )}
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Form.Input
                                        fluid
                                        accept="image/*"
                                        type="file"
                                        onChange={onResourceImageInputChange}
                                        style={{ marginBottom: '-0.5em' }}
                                    />
                                    <TextArea
                                        style={{ resize: 'none' }}
                                        placeholder="Resource description"
                                        value={resource.description || ''}
                                        onChange={onResourceDescriptionInputChange}
                                        required
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <Form.Group widths="equal">
                            <Form.Select
                                fluid
                                label="Type"
                                placeholder="Type"
                                options={typesOptions}
                                value={resource.typeId || ''}
                                onChange={onResourceTypeIdInputChange}
                                required
                            />
                            <Form.Select
                                fluid
                                label="Language"
                                placeholder="Language"
                                options={localNameOptions}
                                value={resource.locale || ''}
                                onChange={onResourceLanguageInputChange}
                                required
                            />
                            <Form.Select
                                fluid
                                label="Pricing"
                                placeholder="Pricing"
                                options={pricesOptions}
                                value={resource.priceId || ''}
                                onChange={onResourcePriceIdInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group widths="equal">
                            <Form.Input
                                fluid
                                label="Score"
                                placeholder="Score"
                                type="number"
                                value={resource.score || ''}
                                onChange={onResourceScoreInputChange}
                                required
                            />
                            <Form.Input
                                fluid
                                label="Interface"
                                placeholder="Interface"
                                type="number"
                                value={resource.interfaceScore || ''}
                                onChange={onResourceInterfaceScoreInputChange}
                                required
                            />
                            <Form.Input
                                fluid
                                label="Renommée"
                                placeholder="Renommée"
                                type="number"
                                value={resource.renown || ''}
                                onChange={onResourceRenownScoreInputChange}
                                required
                            />
                        </Form.Group>
                        <Grid style={{ marginBottom: 0 }}>
                            <Grid.Column>
                                <Header as="h5" attached="top">
                                    Associated Tags
                                </Header>
                                <Segment attached>
                                    {resource.tags && resource.tags.length > 0 ? (
                                        <Label.Group style={{ marginBottom: '-0.5em' }}>
                                            {resource.tags.map(tag => (
                                                <Label
                                                    key={tag.tagId}
                                                    color="teal"
                                                    image
                                                    style={{ marginBottom: '0.5em' }}
                                                >
                                                    <Icon
                                                        name="trash alternate"
                                                        link
                                                        onClick={(): void =>
                                                            removeSelectedTag(tag.tagId)
                                                        }
                                                    />
                                                    {tag.tag.name}
                                                    <Label.Detail>
                                                        <Icon
                                                            name="minus"
                                                            size="small"
                                                            link
                                                            onClick={(): void =>
                                                                decrementSelectedTag(tag.tagId)
                                                            }
                                                        />
                                                        &nbsp;{tag.belonging}&nbsp;
                                                        <Icon
                                                            name="plus"
                                                            size="small"
                                                            link
                                                            onClick={(): void =>
                                                                incrementSelectedTag(tag.tagId)
                                                            }
                                                        />
                                                    </Label.Detail>
                                                </Label>
                                            ))}
                                        </Label.Group>
                                    ) : (
                                        <>No tags selected!</>
                                    )}
                                </Segment>
                                <Segment attached secondary>
                                    {displayedTagOptions.length ? (
                                        <Label.Group style={{ marginBottom: '-0.5em' }}>
                                            {displayedTagOptions.map(tag => (
                                                <Label
                                                    key={tag.key}
                                                    as="a"
                                                    onClick={(): void => addSelectedTag(tag.key)}
                                                >
                                                    <Icon name="plus" />
                                                    {tag.text}
                                                </Label>
                                            ))}
                                        </Label.Group>
                                    ) : (
                                        <>No tags available!</>
                                    )}
                                </Segment>
                            </Grid.Column>
                        </Grid>
                        <FormFooter
                            isSubmitDisabled={!isReadyToSubmit}
                            onSubmitClick={saveResource}
                            backButtonURL={ADMIN_APP_ROUTES.RESOURCES}
                        />
                    </Form>
                </>
            ) : (
                <div />
            )}
        </div>
    );
};
