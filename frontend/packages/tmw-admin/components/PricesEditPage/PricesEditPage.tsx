import { useRouter } from 'next/router';
import * as React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { FormFooter } from 'tmw-admin/components/FormFooter';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import { Price } from 'tmw-admin/constants/app-types';
import { serializePriceFromAPI, serializePriceToAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxPost, ajaxPut } from 'tmw-common/utils/ajax';

export const PricesEditPage: React.FunctionComponent = () => {
    const [price, setPrice] = React.useState<Partial<Price>>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [canEdit, setCanEdit] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');

    const router = useRouter();
    const { id: editedPriceId } = router.query;

    const isReadyToSubmit = price.name && price.name.length > 0;

    const fetchPrice = async (): Promise<void> => {
        return ajaxGet(`prices/${editedPriceId}`)
            .then(res => {
                const price = serializePriceFromAPI(res.data);
                setPrice(price);
            })
            .catch(() => {
                setErrorMessage('Error while trying to fetch price data from the API.');
                setCanEdit(false);
            });
    };

    const onPriceNameInputChange = (_: any, { value }: { value: string }): void => {
        setPrice({ ...price, name: value });
    };

    const resetForm = (): void => {
        setPrice({});
    };

    const savePrice = (): void => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        const newPrice = serializePriceToAPI(price);
        newPrice.id = editedPriceId?.toString();

        if (editedPriceId) {
            ajaxPut(`prices/${editedPriceId}`, newPrice)
                .then(() => {
                    setSuccessMessage('Your price "' + price.name + '" was successfully edited.');
                })
                .catch(() => {
                    setErrorMessage(
                        'Error while updating the price. Your modifications were probably not saved.',
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            ajaxPost('prices', newPrice)
                .then(() => {
                    setSuccessMessage(
                        'Your new price "' + price.name + '" was successfully saved.',
                    );
                    resetForm();
                })
                .catch(() => {
                    setErrorMessage(
                        'Error while posting new price to API. The new price was probably not saved.',
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    React.useEffect(() => {
        if (!router.isReady) return;

        if (editedPriceId) {
            setIsLoading(true);
            fetchPrice().finally(() => {
                setIsLoading(false);
            });
        }
    }, [router.isReady]);

    return (
        <div>
            <PageHeader
                iconName="eur"
                headerContent={editedPriceId ? 'Edit Price' : 'Add Price'}
                subHeaderContent={
                    editedPriceId
                        ? 'Edit an existing price'
                        : 'Add a price to be used for resources'
                }
            />
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {canEdit && (
                <>
                    <Message
                        attached
                        header={
                            editedPriceId ? 'Edit an existing price' : 'Add a price for resources'
                        }
                    />
                    <Form className="attached fluid segment" loading={isLoading}>
                        <Form.Group widths="equal">
                            <Form.Input
                                fluid
                                label="Price Name"
                                placeholder="Price Name"
                                value={price.name || ''}
                                onChange={onPriceNameInputChange}
                                required
                            />
                        </Form.Group>
                        <FormFooter
                            isSubmitDisabled={!isReadyToSubmit}
                            onSubmitClick={savePrice}
                            backButtonURL={ADMIN_APP_ROUTES.PRICES}
                        />
                    </Form>
                </>
            )}
        </div>
    );
};
