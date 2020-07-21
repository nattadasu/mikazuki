import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { AppState, RootState } from '../types';

const state: AppState = {
  _locale: process.env.VUE_APP_I18N_FALLBACK_LOCALE as string,
  _darkMode: true,
  _loading: false,
  _navigationDrawerListItemColor: 'auto',
  _navigationDrawerBackgroundBrightness: 100,
  _navigationDrawerBackgroundBlurriness: 0,
  _listItemForceDisableAnimationAmount: 200,
  _listItemStartAmount: 25,
};

const getters: GetterTree<AppState, RootState> = {
  language(state): string {
    return state._locale;
  },
  darkMode(state): boolean {
    return state._darkMode;
  },
  isLoading(state): boolean {
    return state._loading;
  },
  navigationDrawerListItemColor(state): string {
    return state._navigationDrawerListItemColor;
  },
  navigationDrawerBackgroundBrightness(state): number {
    return state._navigationDrawerBackgroundBrightness;
  },
  navigationDrawerBackgroundBlurriness(state): number {
    return state._navigationDrawerBackgroundBlurriness;
  },
  listItemForceDisableAnimationAmount(state): number {
    return state._listItemForceDisableAnimationAmount;
  },
  listItemStartAmount(state): number {
    return state._listItemStartAmount;
  },
};

const mutations: MutationTree<AppState> = {
  setLanguage(state, locale: string) {
    state._locale = locale;
  },
  setDarkMode(state, payload: boolean) {
    state._darkMode = payload;
  },
  setLoadingState(state, payload: boolean) {
    state._loading = payload;
  },
  setNavigationDrawerListItemColor(state, payload: string) {
    state._navigationDrawerListItemColor = payload;
  },
  setNavigationDrawerBackgroundBrightness(state, payload: number) {
    state._navigationDrawerBackgroundBrightness = payload;
  },
  setNavigationDrawerBackgroundBlurriness(state, payload: number) {
    state._navigationDrawerBackgroundBlurriness = payload;
  },
  setListItemForceDisableAnimationAmount(state, payload: number) {
    state._listItemForceDisableAnimationAmount = payload;
  },
  setListItemStartAmount(state, payload: number) {
    state._listItemStartAmount = payload;
  },
};

const actions: ActionTree<AppState, RootState> = {
  async setLanguage({ commit }, payload: string): Promise<void> {
    commit('setLanguage', payload);

    return Promise.resolve();
  },
  async setDarkMode({ commit }, payload: boolean): Promise<void> {
    commit('setDarkMode', payload);

    return Promise.resolve();
  },
  async setLoadingState({ commit }, payload: boolean): Promise<void> {
    commit('setLoadingState', payload);

    return Promise.resolve();
  },
};

const module: Module<AppState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;
