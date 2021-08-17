export interface InputSelectOption {
    key: string;
    value: string;
    text: string;
}

export const convertToSelectOptions = (
    array: Array<any>,
    valueKey: string,
    textKey: string,
): InputSelectOption[] => {
    const selectOptions: InputSelectOption[] = [];
    array.forEach(el => {
        if (el[valueKey] && el[textKey]) {
            selectOptions.push({
                key: el[valueKey],
                value: el[valueKey],
                text: el[textKey],
            });
        }
    });
    return selectOptions;
};
