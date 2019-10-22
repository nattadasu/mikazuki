import _Vue from 'vue';
import AniListAPI from './api-class';

export const API = new AniListAPI();

export default (Vue: typeof _Vue): void => {
  // eslint-disable-next-line no-param-reassign
  Vue.prototype.$http = new AniListAPI();
};
