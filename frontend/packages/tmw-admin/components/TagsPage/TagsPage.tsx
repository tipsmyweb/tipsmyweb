import * as React from 'react';
import Link from 'next/link';
import { Button, Icon, Label, Loader, Table } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import { Tag } from 'tmw-admin/constants/app-types';
import { serializeTagsFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxDelete } from 'tmw-common/utils/ajax';

export const TagsPage: React.FunctionComponent = () => {
    const [tags, setTags] = React.useState<Tag[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const hasError = errorMessage.length > 0;
    const isEmpty = tags.length == 0;

    const fetchTags = async (): Promise<void> => {
        return ajaxGet('tags')
            .then(res => {
                const tags = serializeTagsFromAPI(res.data);
                setTags(tags);
            })
            .catch(() => {
                setErrorMessage('Error while fetching tags list from API.');
            });
    };

    const deleteTag = async (tagId: string, tagName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxDelete(`tags/${tagId}`)
            .then(() => {
                setSuccessMessage('The tag "' + tagName + '" was successfully deleted.');
                return fetchTags();
            })
            .catch(() => {
                setErrorMessage('Error while trying to delete the tag "' + tagName + '".');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const disableTag = async (tagId: string, tagName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxGet(`tags/disable/${tagId}`)
            .then(() => {
                setSuccessMessage('The tag "' + tagName + '" was successfully disabled.');
                return fetchTags();
            })
            .catch(() => {
                setErrorMessage('Error while trying to disable the tag "' + tagName + '".');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const enableTag = async (tagId: string, tagName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxGet(`tags/enable/${tagId}`)
            .then(() => {
                setSuccessMessage('The tag "' + tagName + '" was successfully activated.');
                return fetchTags();
            })
            .catch(() => {
                setErrorMessage('Error while trying to activate the tag "' + tagName + '".');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const restoreTag = async (tagId: string, tagName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxGet(`tags/restore/${tagId}`)
            .then(() => {
                setSuccessMessage('The tag "' + tagName + '" was successfully restored.');
                return fetchTags();
            })
            .catch(() => {
                setErrorMessage('Error while trying to restore the tag "' + tagName + '".');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const setTagPrimary = async (tagId: string, tagName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxGet(`tags/primary/${tagId}`)
            .then(() => {
                setSuccessMessage('The tag "' + tagName + '" was successfully set as primary.');
                return fetchTags();
            })
            .catch(() => {
                setErrorMessage('Error while trying to set the tag "' + tagName + ' as primary".');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const setTagSecondary = async (tagId: string, tagName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxGet(`tags/secondary/${tagId}`)
            .then(() => {
                setSuccessMessage('The tag "' + tagName + '" was successfully set as secondary.');
                return fetchTags();
            })
            .catch(() => {
                setErrorMessage(
                    'Error while trying to set the tag "' + tagName + ' as secondary".',
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    React.useEffect(() => {
        fetchTags().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="tags"
                headerContent="Tags"
                subHeaderContent="Tags proposed to search for a type of resources"
            />
            <Link href={ADMIN_APP_ROUTES.TAGS_ADD}>
                <Button fluid icon>
                    Add Tag
                </Button>
            </Link>
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {isLoading ? (
                <Loader active inline="centered" />
            ) : hasError ? null : isEmpty ? (
                <ActionMessage
                    type="warning"
                    message='Click on the "Add Tag" button to add your first tag!'
                    messageHeader="No tags for now..."
                />
            ) : (
                <Table celled striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Slug</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Visibility</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Edit
                            </Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Delete
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tags.map(tag => (
                            <Table.Row key={tag.id}>
                                <Table.Cell>{tag.name}</Table.Cell>
                                <Table.Cell>{tag.slug}</Table.Cell>
                                <Table.Cell>
                                    {tag.primary ? (
                                        <Label
                                            as="a"
                                            color="teal"
                                            onClick={(): void => {
                                                setTagSecondary(tag.id, tag.name);
                                            }}
                                        >
                                            Primary
                                        </Label>
                                    ) : (
                                        <Label
                                            as="a"
                                            onClick={(): void => {
                                                setTagPrimary(tag.id, tag.name);
                                            }}
                                        >
                                            Secondary
                                        </Label>
                                    )}
                                </Table.Cell>
                                <Table.Cell>
                                    {tag.deletedAt ? (
                                        <Label>Deleted</Label>
                                    ) : tag.disabled ? (
                                        <Label
                                            as="a"
                                            color="yellow"
                                            onClick={(): void => {
                                                enableTag(tag.id, tag.name);
                                            }}
                                        >
                                            Disabled
                                        </Label>
                                    ) : (
                                        <Label
                                            as="a"
                                            color="teal"
                                            onClick={(): void => {
                                                disableTag(tag.id, tag.name);
                                            }}
                                        >
                                            Available
                                        </Label>
                                    )}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {tag.deletedAt ? (
                                        ''
                                    ) : (
                                        <Link
                                            href={ADMIN_APP_ROUTES.TAGS_EDIT.replace(':id', tag.id)}
                                        >
                                            <Icon name="edit" color="blue" link />
                                        </Link>
                                    )}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    {tag.deletedAt ? (
                                        <Label
                                            as="a"
                                            onClick={(): void => {
                                                restoreTag(tag.id, tag.name);
                                            }}
                                        >
                                            Restore
                                        </Label>
                                    ) : (
                                        <Icon
                                            name="trash alternate"
                                            color="red"
                                            link
                                            onClick={(): void => {
                                                deleteTag(tag.id, tag.name);
                                            }}
                                        />
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
    );
};
