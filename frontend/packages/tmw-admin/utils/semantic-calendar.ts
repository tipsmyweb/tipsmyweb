export const getSemanticCalendarDateFormat = (date: Date): string => {
    const day = ('0' + date.getDate()).slice(-2);
    const monthNumber = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return day + '-' + monthNumber + '-' + year;
};

export const serializeSemanticCalendarValueToCurrentDate = (numberOfDays: number): string => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numberOfDays);

    return `${getSemanticCalendarDateFormat(startDate)} - ${getSemanticCalendarDateFormat(
        endDate,
    )}`;
};

export const getDateFromSemanticCalendarFormat = (strDate: string): Date => {
    // SemanticCalendarFormat dd-MM-YYYY
    const splittedStrDate = strDate.split('-');
    const day = Number(splittedStrDate[0]);
    const month = Number(splittedStrDate[1]);
    const year = Number(splittedStrDate[2]);

    return new Date(year, month - 1, day);
};

export const getApiFormatStartDateFromSemanticCalendarValue = (calendarValue: string): Date => {
    // Expected Format "dd-MM-YYYY - dd-MM-YYYY"
    return getDateFromSemanticCalendarFormat(calendarValue.substring(0, 10));
};

export const getApiFormatEndDateFromSemanticCalendarValue = (calendarValue: string): Date => {
    // Expected Format "dd-MM-YYYY - dd-MM-YYYY"
    return getDateFromSemanticCalendarFormat(calendarValue.substring(13, 23));
};

export const isSemanticCalendarValueValue = (calendarValue: string): boolean => {
    // Expected Format "dd-MM-YYYY - dd-MM-YYYY"
    return calendarValue.length == 23;
};
