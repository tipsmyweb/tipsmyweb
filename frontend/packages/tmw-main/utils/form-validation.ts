export const isValidEmail = (email: string): boolean => {
    const emailRegex = RegExp(/^[^@]+@[^@]+\.[^@]+$/);
    return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
    const emailRegex = RegExp(
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]+$/,
    );
    return emailRegex.test(url);
};

export const addHttpPrefix = (url: string): string => {
    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
        return `http://${url}`;
    }
    return url;
};
