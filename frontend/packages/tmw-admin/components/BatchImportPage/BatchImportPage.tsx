import * as React from 'react';
import { ActionMessage } from 'tmw-admin/components/ActionMessage';
import { FormFooter } from 'tmw-admin/components/FormFooter';
import { InputSelectOption } from 'tmw-admin/utils/select-options';
import * as XLSX from 'xlsx';
import { PageHeader } from 'tmw-admin/components/PageHeader';
import { Form, Message, List, DropdownProps } from 'semantic-ui-react';
import { ajaxGet, ajaxPost } from 'tmw-common/utils/ajax';
import {
    serializePricesFromAPI,
    serializeResourceTypesFromAPI,
    serializeTagsFromAPI,
} from 'tmw-admin/utils/api-serialize';

const importTypeOptions: InputSelectOption[] = [
    { key: 'resources', value: 'resources', text: 'Resources' },
    { key: 'tags', value: 'tags', text: 'Tags' },
];

export const BatchImportPage: React.FunctionComponent = () => {
    const [importType, setImportType] = React.useState<string>('');
    const [importedFile, setImportedFile] = React.useState<File>();
    const [fileIsValidated, setFileIsValidated] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [successMessage, setSuccessMessage] = React.useState<string>('');
    const [infoMessage, setInfoMessage] = React.useState<string>('');
    const [validResourcePriceNames, setValidResourcePriceNames] = React.useState<string[]>([]);
    const [validResourceTypeNames, setValidResourceTypeNames] = React.useState<string[]>([]);
    const [validTagNames, setValidTagNames] = React.useState<string[]>([]);
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const isReadyToValidate = importedFile !== undefined && importType.length > 0;
    const isReadyToImport = importedFile !== undefined && importType.length > 0 && fileIsValidated;

    const fetchTagSlugs = async (): Promise<void> => {
        return ajaxGet('tags')
            .then(res => {
                const tags = serializeTagsFromAPI(res.data);
                setValidTagNames(tags.map(t => t.name));
            })
            .catch(() => {
                setErrorMessage('Error while fetching tags list from API.');
            });
    };

    const fetchResourcePriceNames = async (): Promise<void> => {
        return ajaxGet('prices')
            .then(res => {
                const prices = serializePricesFromAPI(res.data);
                setValidResourcePriceNames(prices.map(p => p.name));
            })
            .catch(() => {
                setErrorMessage('Error while fetching resource prices list from API.');
            });
    };

    const fetchResourceTypeNames = async (): Promise<void> => {
        return ajaxGet('types')
            .then(res => {
                const types = serializeResourceTypesFromAPI(res.data);
                setValidResourceTypeNames(types.map(t => t.name));
            })
            .catch(() => {
                setErrorMessage('Error while fetching resource types list from API.');
            });
    };

    const loadValidationRules = (): void => {
        fetchTagSlugs();
        fetchResourcePriceNames();
        fetchResourceTypeNames();
    };

    React.useEffect(() => {
        loadValidationRules();
    }, []);

    const onImportTypeInputChange = (
        _: React.SyntheticEvent<HTMLElement>,
        data: DropdownProps,
    ): void => {
        setImportType(data.value?.toString() ?? '');
    };

    const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (event.target.files) {
            const file = event.target.files[0];
            if (
                file &&
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
                setImportedFile(file);
            } else if (file) {
                setErrorMessage('File format should be .xlsx');
            }
        }
    };

    const resetForm = (): void => {
        setImportType('');
        setImportedFile(undefined);
    };

    const submitBatchData = (data: any): void => {
        setIsLoading(true);
        ajaxPost(`import/${importType}`, { data })
            .then(res => {
                setSuccessMessage(`The file was successfully imported! \n ${res.data}`);
                resetForm();
            })
            .catch(() => {
                setErrorMessage(
                    'Error while posting the file to the API. The import probably failed.',
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const validateData = (data: any): void => {
        setIsLoading(true);
        ajaxPost(`import/validation/${importType}`, { data })
            .then(res => {
                setValidationErrors(res.data);
                setFileIsValidated(true);
                setInfoMessage('Data have been validated.');
            })
            .catch(() => {
                setErrorMessage('Error while posting the file to the API.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleFile = (withImport = false): void => {
        /* Boilerplate to set up FileReader */
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;

        reader.onload = (e): void => {
            /* Parse data */
            const bstr = e.target ? e.target.result : null;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA: true });
            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            const data = XLSX.utils.sheet_to_json(ws);
            /* Update state */

            if (withImport) {
                submitBatchData(data);
            } else {
                validateData(data);
            }
        };

        if (importedFile) {
            if (rABS) {
                reader.readAsBinaryString(importedFile);
            } else {
                reader.readAsArrayBuffer(importedFile);
            }
        } else {
            setErrorMessage('Error while trying to read batch file.');
        }
    };

    return (
        <div>
            <PageHeader
                iconName="plus circle"
                headerContent="Batch Import"
                subHeaderContent="Import resources and tags from a file"
            />
            <ActionMessage type="success" message={successMessage} />
            <ActionMessage type="error" message={errorMessage} />
            <ActionMessage type="info" message={infoMessage} />
            <Message
                attached
                header="Import a batch file"
                content="The resources/tags will be imported all at once. Element with validation errors won't be imported."
            />
            <Form className="attached fluid segment" loading={isLoading}>
                <Form.Group widths="equal">
                    <Form.Input
                        fluid
                        label="File"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        type="file"
                        onChange={onFileInputChange}
                        required
                    />
                    <Form.Select
                        fluid
                        label="Type"
                        placeholder="Type"
                        options={importTypeOptions}
                        value={importType}
                        onChange={onImportTypeInputChange}
                        required
                    />
                </Form.Group>
                <FormFooter
                    isSubmitDisabled={!isReadyToValidate}
                    onSubmitClick={() => handleFile(isReadyToImport)}
                    buttonValue={isReadyToImport ? 'Submit' : 'Validation'}
                />
            </Form>
            {importType == 'resources' && (
                <div>
                    <Message
                        attached
                        header="Special validation rules"
                        content="Some resource attributes only accept a list of values which are displayed here."
                    />
                    <Form className="attached fluid segment">
                        <List bulleted>
                            <List.Item>
                                <strong>language</strong>: fr | en | en,fr | es | fr,es | en,es |
                                en,fr,es
                            </List.Item>
                            <List.Item>
                                <strong>tag</strong>:
                                {validTagNames
                                    .sort((a, b) => {
                                        return a > b ? 1 : -1;
                                    })
                                    .map(tagSlug => (
                                        <span key={tagSlug}> {tagSlug} | </span>
                                    ))}
                            </List.Item>
                            <List.Item>
                                <strong>price</strong>:
                                {validResourcePriceNames
                                    .sort((a, b) => {
                                        return a > b ? 1 : -1;
                                    })
                                    .map(priceName => (
                                        <span key={priceName}> {priceName} | </span>
                                    ))}
                            </List.Item>
                            <List.Item>
                                <strong>type</strong>:
                                {validResourceTypeNames
                                    .sort((a, b) => {
                                        return a > b ? 1 : -1;
                                    })
                                    .map(typeName => (
                                        <span key={typeName}> {typeName} | </span>
                                    ))}
                            </List.Item>
                        </List>
                    </Form>
                </div>
            )}
            {validationErrors.length > 0 ? (
                <Message error header="Errors found in batch file" list={validationErrors} />
            ) : null}
        </div>
    );
};
