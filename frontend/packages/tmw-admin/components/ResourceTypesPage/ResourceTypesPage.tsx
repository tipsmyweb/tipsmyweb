import * as React from 'react';
import Link from 'next/link';
import { Button, Icon, Loader, Table } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import { ResourceType } from 'tmw-admin/constants/app-types';
import { serializeResourceTypesFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxDelete } from 'tmw-common/utils/ajax';

export const ResourceTypesPage: React.FunctionComponent = () => {
    const [types, setTypes] = React.useState<ResourceType[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const hasError = errorMessage.length > 0;
    const isEmpty = types.length == 0;

    const fetchResourceTypes = async (): Promise<void> => {
        return ajaxGet('types')
            .then(res => {
                const prices = serializeResourceTypesFromAPI(res.data);
                setTypes(prices);
            })
            .catch(() => {
                setErrorMessage('Error while fetching resource types list from API.');
            });
    };

    const deleteResourceType = async (typeId: string, typeName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxDelete(`types/${typeId}`)
            .then(() => {
                setSuccessMessage('The resource type "' + typeName + '" was successfully deleted.');
                return fetchResourceTypes();
            })
            .catch(() => {
                setErrorMessage(
                    'Error while trying to delete the resource type "' + typeName + '".',
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    React.useEffect(() => {
        fetchResourceTypes().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="file"
                headerContent="Resource Types"
                subHeaderContent="Types to be used for resources"
            />
            <Link href={ADMIN_APP_ROUTES.RESOURCE_TYPES_ADD}>
                <Button fluid icon>
                    Add Resource Type
                </Button>
            </Link>
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {isLoading ? (
                <Loader active inline="centered" />
            ) : hasError ? null : isEmpty ? (
                <ActionMessage
                    type="warning"
                    message='Click on the "Add Type" button to add your first resource type!'
                    messageHeader="No resource types for now..."
                />
            ) : (
                <Table celled striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Edit
                            </Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Delete
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {types.map(type => (
                            <Table.Row key={type.id}>
                                <Table.Cell>{type.name}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Link
                                        href={ADMIN_APP_ROUTES.RESOURCE_TYPES_EDIT.replace(
                                            ':id',
                                            type.id,
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
                                            deleteResourceType(type.id, type.name);
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
