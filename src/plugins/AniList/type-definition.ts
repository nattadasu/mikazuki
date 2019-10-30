import AniListAPI from './api-class';

declare module 'vue/types/vue' {
  interface Vue {
    $http: AniListAPI;
  }
}
