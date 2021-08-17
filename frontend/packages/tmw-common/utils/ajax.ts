import axios, { AxiosRequestConfig } from 'axios';

// WARNING: The equivalent constant in the backend should be the same value !
export const TOKEN_VALIDITY_TIME = 2 * 3600 * 1000;

export interface AuthToken {
    token: string;
    expiration: number;
}

export const emptyLocalStorage = (): void => localStorage.clear();

export const removeLocalToken = (): void => localStorage.removeItem('token');

export const getLocalToken = (): string | null => {
    const rawAuthToken = localStorage.getItem('token');
    if (rawAuthToken) {
        try {
            const authToken: AuthToken = JSON.parse(rawAuthToken);
            if (
                authToken.expiration > Date.now() &&
                authToken.expiration <= Date.now() + TOKEN_VALIDITY_TIME
            ) {
                return authToken.token;
            }
        } catch {
            removeLocalToken();
        }
    }
    // Remove token if it's not valid anymore or if parsing failed
    removeLocalToken();
    return null;
};

interface RequestConfigOptions {
    contentType?: string | null;
    contentLength?: string | null;
}

/*
 * Build request headers by adding the authentication token and some
 * additional information about the content that is sent.
 */
const buildRequestConfig = ({
    contentLength = null,
    contentType = 'application/json',
}: RequestConfigOptions): AxiosRequestConfig => ({
    headers: {
        ...(contentType !== null && { ContentType: contentType }),
        ...(contentLength !== null && { ContentLength: contentLength }),
        Authorization: getLocalToken() || '',
    },
});

export const ajaxGet = (path: string): Promise<any> => {
    const config = buildRequestConfig({});
    return axios.get(`/api/${path}`, config);
};

export const ajaxPost = (path: string, data: object): Promise<any> => {
    const config = buildRequestConfig({});
    return axios.post(`/api/${path}`, data, config);
};

export const ajaxPut = (path: string, data: object): Promise<any> => {
    const config = buildRequestConfig({});
    return axios.put(`/api/${path}`, data, config);
};

export const ajaxDelete = (path: string): Promise<any> => {
    const config = buildRequestConfig({});
    return axios.delete(`/api/${path}`, config);
};

export const ajaxPostImage = (path: string, data: object): Promise<any> => {
    const config = buildRequestConfig({ contentType: null });
    return axios.post(`/api/${path}`, data, config);
};

/*
export const putFile = (file: any): void => {
    const fileReader = new FileReader();
    fileReader.onload = async (e): Promise<any> => {
        const { result } = e.target; //TODO: Fix type error
        const config = buildRequestConfig({ contentType: file.type, contentLength: file.length });
        return axios.post('/api/file', result, config);
    };
};
 */
