/*
 *--------------------------------------------------------------------------
 * Axios defaults
 *--------------------------------------------------------------------------
 *
 * The default config for axios. "withCredentials" is necessary in order to
 * get access to the laravel backend. The "baseURL" should match the domain
 * and port of your laravel api.
 *
 */
import axios from 'axios';
// Configure axios in order to be able to make api requests to the laravel backend.
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_HOST_URL;
