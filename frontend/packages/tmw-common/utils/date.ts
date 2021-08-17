export function getApiDateFormat(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const monthNumber = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();

    return year + '-' + monthNumber + '-' + day;
}

export function getTimeFromApiDate(apiDate: Date){
    const date = new Date(apiDate);
    return (
        ('0' + (date.getHours() + 1)).slice(-2) + ':' + ('0' + (date.getMinutes() + 1)).slice(-2)
    );
}
