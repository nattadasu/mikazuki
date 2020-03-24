import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import appModule from './modules/app';
import aniListModule from './modules/aniList';
import userSettingsModule from './modules/userSettings';
import { RootState } from './types';

Vue.use(Vuex);

const { plugin: localPersist } = new VuexPersistence<RootState>({
  storage: window.localStorage,
  key: 'mikazuki-localstorage',
  modules: ['app', 'userSettings'],
});

const { plugin: sessionPersist } = new VuexPersistence<RootState>({
  storage: window.sessionStorage,
  key: 'mikazuki-sessionstorage',
  modules: ['aniList'],
});

const plugins = [localPersist, sessionPersist];

const store = new Vuex.Store<RootState>({
  actions: {
    async resetAllData({ dispatch }) {
      await dispatch('aniList/resetAllData');
      // TODO: Add resetAllData for other modules as well

      return Promise.resolve();
    },
  },
  modules: {
    app: appModule,
    aniList: aniListModule,
    userSettings: userSettingsModule,
  },
  plugins,
});

export default store;
