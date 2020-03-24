import { AxiosInstance } from 'axios';
import store from '@/store';

export default (axios: AxiosInstance) => {
  // Automatically add Authorization token if available
  axios.interceptors.request.use((config) => {
    if (store.state.userSettings._session.accessToken) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${store.state.userSettings._session.accessToken}`;
    }

    if (config.data.query && config.data.query.loc) {
      // eslint-disable-next-line no-param-reassign
      config.data.query = config.data.query.loc.source.body;
    }

    return config;
  });

  axios.interceptors.response.use((response) => response.data.data);
};
