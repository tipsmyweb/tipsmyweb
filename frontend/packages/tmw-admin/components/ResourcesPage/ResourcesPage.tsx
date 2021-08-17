import * as React from 'react';
import Link from 'next/link';
import { Button, Icon, Label, Loader, Table, Popup } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES, MAX_CONTENT_LENGTH } from 'tmw-admin/constants/app-constants';
import { Resource } from 'tmw-admin/constants/app-types';
import { serializeResourcesFromAPI } from 'tmw-admin/utils/api-serialize';
import { wrapText, wrapTagsDisplay } from 'tmw-admin/utils/content-wrapper';
import { ajaxGet, ajaxDelete } from 'tmw-common/utils/ajax';

export const ResourcesPage: React.FunctionComponent = () => {
    const [resources, setResources] = React.useState<Resource[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const hasError = errorMessage.length > 0;
    const isEmpty = resources.length == 0;

    const fetchResources = async (): Promise<void> => {
        return ajaxGet('resources')
            .then(res => {
                const resources = serializeResourcesFromAPI(res.data);
                setResources(resources);
            })
            .catch(() => {
                setErrorMessage('Error while fetching resources list from API.');
            });
    };

    const deleteResource = async (resourceId: string, resourceName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxDelete(`resources/${resourceId}`)
            .then(() => {
                setSuccessMessage('The resource "' + resourceName + '" was successfully deleted.');
                return fetchResources();
            })
            .catch(() => {
                setErrorMessage(
                    'Error while trying to delete the resource "' + resourceName + '".',
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    React.useEffect(() => {
        fetchResources().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="world"
                headerContent="Resources"
                subHeaderContent="Resources that can be searched through TipsMyWeb"
            />
            <Link href={ADMIN_APP_ROUTES.RESOURCES_ADD}>
                <Button fluid icon>
                    Add Resource
                </Button>
            </Link>
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {isLoading ? (
                <Loader active inline="centered" />
            ) : hasError ? null : isEmpty ? (
                <ActionMessage
                    type="warning"
                    message='Click on the "Add Resource" button to add your first resource!'
                    messageHeader="No resources for now..."
                />
            ) : (
                <Table celled striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>URL</Table.HeaderCell>
                            <Table.HeaderCell>Likes</Table.HeaderCell>
                            <Table.HeaderCell>Tags</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Edit
                            </Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Delete
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {resources.map(resource => (
                            <Table.Row key={resource.id}>
                                <Table.Cell>{resource.name}</Table.Cell>
                                <Popup
                                    content={resource.url}
                                    trigger={
                                        <Table.Cell>
                                            {wrapText(
                                                resource.url,
                                                MAX_CONTENT_LENGTH.RESOURCES_INDEX_PAGE_URL,
                                            )}
                                        </Table.Cell>
                                    }
                                />
                                <Table.Cell>{resource.likes}</Table.Cell>
                                <Popup
                                    content={resource.tags.map(rt => rt.tag.name).join(', ')}
                                    trigger={
                                        <Table.Cell>
                                            <Label.Group style={{ marginBottom: '-0.5em' }}>
                                                {wrapTagsDisplay(
                                                    resource.tags,
                                                    MAX_CONTENT_LENGTH.RESOURCES_INDEX_PAGES_TAGS,
                                                ).map(tag => (
                                                    <Label key={tag.tagId} size="small">
                                                        {tag.tag.name}
                                                    </Label>
                                                ))}
                                                {resource.tags.length >
                                                MAX_CONTENT_LENGTH.RESOURCES_INDEX_PAGES_TAGS ? (
                                                    <Label>..</Label>
                                                ) : (
                                                    ''
                                                )}
                                            </Label.Group>
                                        </Table.Cell>
                                    }
                                />
                                <Table.Cell textAlign="center">
                                    <Link
                                        href={ADMIN_APP_ROUTES.RESOURCES_EDIT.replace(
                                            ':id',
                                            resource.id,
                                        )}
                                    >
                                        <Icon name="edit" color="blue" link />
                                    </Link>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Icon
                                        name="trash alternate"
                                        color="red"
                                        link
                                        onClick={(): void => {
                                            deleteResource(resource.id, resource.name);
                                        }}
                                    />
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            )}
        </div>
    );
};
