import { APIAuthenticationErrors, LoginAPIResponse } from 'tmw-admin/constants/api-types';
import { ADMIN_APP_ROUTES } from 'tmw-admin/constants/app-constants';
import {
    ajaxPost,
    AuthToken,
    emptyLocalStorage,
    getLocalToken,
    removeLocalToken,
    TOKEN_VALIDITY_TIME,
} from 'tmw-common/utils/ajax';
import axios, { AxiosError } from 'axios';

export const setLocalToken = (token: string): void => {
    const authToken: AuthToken = {
        token,
        expiration: Date.now() + TOKEN_VALIDITY_TIME,
    };
    localStorage.setItem('token', JSON.stringify(authToken));
};

export const checkAuthentication = (): boolean => !!getLocalToken();

export const redirectUser = (): void => {
    if (checkAuthentication()) {
        window.location.href = ADMIN_APP_ROUTES.MAIN;
    } else {
        window.location.href = ADMIN_APP_ROUTES.LOGIN;
    }
};

export const login = async (data: any): Promise<void | string> => {
    emptyLocalStorage();
    return ajaxPost('login', data).then((res: { data: LoginAPIResponse }) => {
        setLocalToken(res.data.token);
        redirectUser();
    });
};

export const logout = (): void => {
    removeLocalToken();
    redirectUser();
};

/*
 * Intercept all axios error and redirect users to the login page
 * if they try to access an api that requires to be logged in.
 */
const catchAuthError = (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
        const response = error.response;
        if (response.status == 403 || response.status == 401) {
            if (Object.values(APIAuthenticationErrors).includes(response.data.message)) {
                logout();
            }
        }
    }
    return Promise.reject(error);
};

axios.interceptors.response.use(response => response, catchAuthError);
