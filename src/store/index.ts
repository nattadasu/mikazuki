import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

// Custom Stores
import { aniListModule, AniListStore } from './AniList';
import { appModule, AppStore } from './App';
import { UserSettings, userSettingsModule } from './UserSettings';

Vue.use(Vuex);

const localPersist = new VuexPersistence({
  storage: window.localStorage,
  key: 'userSettings',
  modules: ['userSettings', 'app'],
});

const sessionPersist = new VuexPersistence({
  storage: window.sessionStorage,
  key: 'rest',
  modules: ['aniList'],
});

export const store: any = new Vuex.Store({
  state: {},
  modules: {
    aniList: aniListModule,
    app: appModule,
    userSettings: userSettingsModule,
  },
  // To keep mutated changes in local Storage
  plugins: [localPersist.plugin, sessionPersist.plugin],
});

/**
 * @module UserSettings This module consists of all user settings
 * @description This creates a proxy for the Vue Templates to use.
 */
export const userStore = UserSettings.CreateProxy(store, UserSettings) as UserSettings;
/**
 * @module AppStore This module contains all general App data
 */
export const appStore = AppStore.CreateProxy(store, AppStore) as AppStore;
/**
 * @module AniListStore This module contains all data concerning AniList
 */
export const aniListStore = AniListStore.CreateProxy(store, AniListStore) as AniListStore;
