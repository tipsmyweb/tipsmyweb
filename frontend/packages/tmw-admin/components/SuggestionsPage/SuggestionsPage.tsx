import * as React from 'react';
import { Icon, Loader, Table, Label } from 'semantic-ui-react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { WebsiteSuggestion } from 'tmw-admin/constants/app-types';
import { serializeSuggestionsFromAPI } from 'tmw-admin/utils/api-serialize';
import { ajaxGet, ajaxDelete } from 'tmw-common/utils/ajax';

export const SuggestionsPage: React.FunctionComponent = () => {
    const [suggestions, setSuggestions] = React.useState<WebsiteSuggestion[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const hasError = errorMessage.length > 0;
    const isEmpty = suggestions.length == 0;

    const fetchWebsiteSuggestions = async (): Promise<void> => {
        return ajaxGet('suggestions')
            .then(res => {
                const suggestions = serializeSuggestionsFromAPI(res.data);
                setSuggestions(suggestions);
            })
            .catch(() => {
                setErrorMessage('Error while fetching suggestions list from API.');
            });
    };

    const deleteSuggestion = async (
        suggestionId: string,
        suggestionName: string,
    ): Promise<void> => {
        setSuccessMessage('');
        setErrorMessage('');
        setIsLoading(true);
        ajaxDelete(`suggestions/${suggestionId}`)
            .then(() => {
                setSuccessMessage(
                    'The suggestion for "' + suggestionName + '" was successfully deleted.',
                );
                return fetchWebsiteSuggestions();
            })
            .catch(() => {
                setErrorMessage('Error while trying to delete suggestion.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const setSuggestionAsRead = async (
        suggestionId: string,
        suggestionUrl: string,
    ): Promise<void> => {
        return ajaxGet(`suggestion/read/${suggestionId}`)
            .then(() => {
                setSuccessMessage(`Suggestion from ${suggestionUrl} set as read.`);
                setIsLoading(true);
                fetchWebsiteSuggestions();
            })
            .catch(() => {
                setErrorMessage('Error while setting the suggestion as read.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const setSuggestionAsUnread = async (
        suggestionId: string,
        suggestionUrl: string,
    ): Promise<void> => {
        return ajaxGet(`suggestion/unread/${suggestionId}`)
            .then(() => {
                setSuccessMessage(`Suggestion from ${suggestionUrl} set as unread.`);
                setIsLoading(true);
                fetchWebsiteSuggestions();
            })
            .catch(() => {
                setErrorMessage('Error while setting the suggestion as unread.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    React.useEffect(() => {
        fetchWebsiteSuggestions().finally(() => {
            setIsLoading(false);
        });
    }, []);

    return (
        <div>
            <PageHeader
                iconName="lightbulb"
                headerContent="Resources Suggestions"
                subHeaderContent='Websites suggestions sent through the "Share a website" form'
            />
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            {isLoading ? (
                <Loader active inline="centered" />
            ) : hasError ? null : isEmpty ? (
                <ActionMessage
                    type="warning"
                    message="Be patient!"
                    messageHeader="No suggestions for now..."
                />
            ) : (
                <Table celled striped selectable unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>URL</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Read</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">
                                Delete
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {suggestions
                            .sort((a, b) => {
                                return b.read && !a.read ? -1 : 1;
                            })
                            .map(suggestion => (
                                <Table.Row key={suggestion.id}>
                                    <Table.Cell
                                        style={{ fontWeight: suggestion.read ? '' : 'bold' }}
                                    >
                                        {suggestion.createdAt}
                                    </Table.Cell>
                                    <Table.Cell
                                        style={{ fontWeight: suggestion.read ? '' : 'bold' }}
                                    >
                                        <a href={suggestion.url} target="_blank" rel="noreferrer">
                                            {suggestion.url}
                                        </a>
                                    </Table.Cell>
                                    <Table.Cell
                                        style={{ fontWeight: suggestion.read ? '' : 'bold' }}
                                    >
                                        {suggestion.description}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        {suggestion.read ? (
                                            <Label
                                                as="a"
                                                onClick={(): void => {
                                                    setSuggestionAsUnread(
                                                        suggestion.id,
                                                        suggestion.url,
                                                    );
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
                                                    setSuggestionAsRead(
                                                        suggestion.id,
                                                        suggestion.url,
                                                    );
                                                }}
                                            />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Icon
                                            name="trash alternate"
                                            color="red"
                                            link
                                            onClick={(): void => {
                                                deleteSuggestion(suggestion.id, suggestion.url);
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
