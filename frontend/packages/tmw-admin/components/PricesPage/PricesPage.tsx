import * as React from 'react';
import Link from 'next/link';
import { Button, Icon, Loader, Table } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import { Price } from 'tmw-admin/constants/app-types';
import { serializePricesFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxDelete } from 'tmw-common/utils/ajax';

export const PricesPage: React.FunctionComponent = () => {
    const [prices, setPrices] = React.useState<Price[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const hasError = errorMessage.length > 0;
    const isEmpty = prices.length == 0;

    const fetchPrices = async (): Promise<void> => {
        return ajaxGet('prices')
            .then(res => {
                const prices = serializePricesFromAPI(res.data);
                setPrices(prices);
            })
            .catch(() => {
                setErrorMessage('Error while fetching prices list from API.');
            });
    };

    const deletePrice = async (priceId: string, priceName: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxDelete(`prices/${priceId}`)
            .then(() => {
                setSuccessMessage('The price "' + priceName + '" was successfully deleted.');
                return fetchPrices();
            })
            .catch(() => {
                setErrorMessage('Error while trying to delete the price "' + priceName + '".');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    React.useEffect(() => {
        fetchPrices().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="eur"
                headerContent="Prices"
                subHeaderContent="Prices be used for resources"
            />
            <Link href={ADMIN_APP_ROUTES.PRICES_ADD}>
                <Button fluid icon>
                    Add Price
                </Button>
            </Link>
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {isLoading ? (
                <Loader active inline="centered" />
            ) : hasError ? null : isEmpty ? (
                <ActionMessage
                    type="warning"
                    message='Click on the "Add Price" button to add your first price!'
                    messageHeader="No prices for now..."
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
                        {prices.map(price => (
                            <Table.Row key={price.id}>
                                <Table.Cell>{price.name}</Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Link
                                        href={ADMIN_APP_ROUTES.PRICES_EDIT.replace(':id', price.id)}
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
                                            deletePrice(price.id, price.name);
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
