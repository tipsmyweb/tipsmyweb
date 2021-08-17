import * as React from 'react';
import { Icon, Button, Loader, Table, Label } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { Contact } from 'tmw-admin/constants/app-types';
import { serializeContactsFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxDelete } from 'tmw-common/utils/ajax';

export const ContactPage: React.FunctionComponent = () => {
    const [contacts, setContacts] = React.useState<Contact[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const hasError = errorMessage.length > 0;
    const isEmpty = contacts.length == 0;

    const fetchContactMessages = async (): Promise<void> => {
        return ajaxGet('contacts')
            .then(res => {
                const contacts = serializeContactsFromAPI(res.data);
                setContacts(contacts);
                setIsLoading(false);
            })
            .catch(() => {
                setErrorMessage('Error while fetching contacts list from API.');
            });
    };

    const deleteContact = async (contactId: string): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxDelete(`contacts/${contactId}`)
            .then(() => {
                setSuccessMessage('The message was successfully deleted.');
                return fetchContactMessages();
            })
            .catch(() => {
                setErrorMessage('Error while trying to delete contact message.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const setContactAsRead = async (contactId: string, contactEmail: string): Promise<void> => {
        return ajaxGet(`contact/read/${contactId}`)
            .then(res => {
                setSuccessMessage(`Message from ${contactEmail} set as read.`);
                setIsLoading(true);
                fetchContactMessages();
            })
            .catch(() => {
                setErrorMessage('Error while setting the message as read.');
            });
    };

    const setContactAsUnread = async (contactId: string, contactEmail: string): Promise<void> => {
        return ajaxGet(`contact/unread/${contactId}`)
            .then(res => {
                setSuccessMessage(`Message from ${contactEmail} set as unread.`);
                setIsLoading(true);
                fetchContactMessages();
            })
            .catch(() => {
                setErrorMessage('Error while setting the message as unread.');
            });
    };

    React.useEffect(() => {
        fetchContactMessages().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="comment"
                headerContent="Contact Messages"
                subHeaderContent='Messages sent through the "Contact" form'
            />
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {isLoading ? (
                <Loader active inline="centered" />
            ) : hasError ? null : isEmpty ? (
                <ActionMessage
                    type="warning"
                    message="Be patient!"
                    messageHeader="No contact messages for now..."
                />
            ) : (
                <Table celled striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Message</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Read</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {contacts
                            .sort((a, b) => {
                                return b.read && !a.read ? -1 : 1;
                            })
                            .map(contact => (
                                <Table.Row key={contact.id}>
                                    <Table.Cell style={{ fontWeight: contact.read ? '' : 'bold' }}>
                                        {contact.createdAt}
                                    </Table.Cell>
                                    <Table.Cell style={{ fontWeight: contact.read ? '' : 'bold' }}>
                                        {contact.email}
                                    </Table.Cell>
                                    <Table.Cell style={{ fontWeight: contact.read ? '' : 'bold' }}>
                                        {contact.message}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {contact.read ? (
                                            <Label
                                                as="a"
                                                onClick={(): void => {
                                                    setContactAsUnread(contact.id, contact.email);
                                                }}
                                            >
                                                Mark as unread
                                            </Label>
                                        ) : (
                                            <Icon
                                                name="check circle"
                                                color="teal"
                                                link
                                                onClick={(): void => {
                                                    setContactAsRead(contact.id, contact.email);
                                                }}
                                            />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell collapsing textAlign="center">
                                        <Icon
                                            name="trash alternate"
                                            color="red"
                                            link
                                            onClick={(): void => {
                                                deleteContact(contact.id);
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
