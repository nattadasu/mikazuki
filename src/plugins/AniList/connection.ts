import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AxiosInterceptors from './interceptors';

const axiosConfig: AxiosRequestConfig = {
  baseURL: 'https://graphql.anilist.co/',
};

const axios: AxiosInstance = Axios.create(axiosConfig);
AxiosInterceptors(axios);

export default axios;
