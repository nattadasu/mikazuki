import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import { createProxy, extractVuexModule } from 'vuex-class-component';

// Custom Stores
import AniListModule from './AniList';
import AppModule from './App';
import UserModule from './UserSettings';

Vue.use(Vuex);

const localPersist = new VuexPersistence({
  storage: window.localStorage,
  key: 'userSettings',
  modules: ['userSettings', 'appStore'],
});

const sessionPersist = new VuexPersistence({
  storage: window.sessionStorage,
  key: 'rest',
  modules: ['aniListStore'],
});

export const store: any = new Vuex.Store({
  state: {},
  modules: {
    ...extractVuexModule(AniListModule),
    ...extractVuexModule(AppModule),
    ...extractVuexModule(UserModule),
  },
  // To keep mutated changes in local Storage
  plugins: [localPersist.plugin, sessionPersist.plugin],
});

/**
 * @module UserSettings This module consists of all user settings
 * @description This creates a proxy for the Vue Templates to use.
 */
export const userStore = createProxy(store, UserModule);
/**
 * @module AppStore This module contains all general App data
 */
export const appStore = createProxy(store, AppModule);
/**
 * @module AniListStore This module contains all data concerning AniList
 */
export const aniListStore = createProxy(store, AniListModule);
