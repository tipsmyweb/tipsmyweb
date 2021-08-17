import { useRouter } from 'next/router';
import * as React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { FormFooter } from 'tmw-admin/components/FormFooter';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import { ResourceType } from 'tmw-admin/constants/app-types';
import {
    serializeResourceTypeFromAPI,
    serializeResourceTypeToAPI,
} from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxPost, ajaxPut } from 'tmw-common/utils/ajax';

export const ResourceTypesEditPage: React.FunctionComponent = () => {
    const [type, setType] = React.useState<Partial<ResourceType>>({});
    const isReadyToSubmit = type.name && type.name.length > 0;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [canEdit, setCanEdit] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');

    const router = useRouter();
    const { id: editedTypeId } = router.query;

    const fetchResourceType = async (): Promise<void> => {
        return ajaxGet(`types/${editedTypeId}`)
            .then(res => {
                const type = serializeResourceTypeFromAPI(res.data);
                setType(type);
            })
            .catch(() => {
                setErrorMessage('Error while trying to fetch resource type data from the API.');
                setCanEdit(false);
            });
    };

    const onTypeNameInputChange = (_: any, { value }: { value: string }): void => {
        setType({ ...type, name: value });
    };

    const resetForm = (): void => {
        setType({});
    };

    const saveResourceType = (): void => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        const newType = serializeResourceTypeToAPI(type);
        newType.id = editedTypeId?.toString();

        if (editedTypeId) {
            ajaxPut(`types/${editedTypeId}`, newType)
                .then(() => {
                    setSuccessMessage(
                        'Your resource type "' + type.name + '" was successfully edited.',
                    );
                })
                .catch(() => {
                    setErrorMessage(
                        'Error while updating the resource type. Your modifications were probably not saved.',
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            ajaxPost('types', newType)
                .then(() => {
                    setSuccessMessage(
                        'Your new resource type "' + type.name + '" was successfully saved.',
                    );
                    resetForm();
                })
                .catch(() => {
                    setErrorMessage(
                        'Error while posting new resource type to API. The new resource type was probably not saved.',
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    React.useEffect(() => {
        if (!router.isReady) return;

        if (editedTypeId) {
            setIsLoading(true);
            fetchResourceType().finally(() => {
                setIsLoading(false);
            });
        }
    }, [router.isReady]);

    return (
        <div>
            <PageHeader
                iconName="file"
                headerContent={editedTypeId ? 'Edit Resource Type' : 'Add Resource Type'}
                subHeaderContent={
                    editedTypeId
                        ? 'Edit an existing resource type'
                        : 'Add a type to be used for resources'
                }
            />
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {canEdit && (
                <>
                    <Message
                        attached
                        header={
                            editedTypeId
                                ? 'Edit an existing resource type'
                                : 'Add a type to be used for resources'
                        }
                    />
                    <Form className="attached fluid segment" loading={isLoading}>
                        <Form.Group widths="equal">
                            <Form.Input
                                fluid
                                label="Type Name"
                                placeholder="Type Name"
                                value={type.name || ''}
                                onChange={onTypeNameInputChange}
                                required
                            />
                        </Form.Group>
                        <FormFooter
                            isSubmitDisabled={!isReadyToSubmit}
                            onSubmitClick={saveResourceType}
                            backButtonURL={ADMIN_APP_ROUTES.RESOURCE_TYPES}
                        />
                    </Form>
                </>
            )}
        </div>
    );
};
