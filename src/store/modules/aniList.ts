import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { AniListState, RootState } from '../types';
import { IAniListMediaListCollection, IAniListActivity } from '@/types';

const state: AniListState = {
  _aniListData: { lists: [] },
  _latestActivities: [],
  _currentMediaTitle: '',
};

const getters: GetterTree<AniListState, RootState> = {
  aniListData(state): IAniListMediaListCollection {
    return state._aniListData;
  },
  latestActivities(state): IAniListActivity[] {
    return state._latestActivities;
  },
  currentMediaTitle(state): string {
    return state._currentMediaTitle;
  },
};

const mutations: MutationTree<AniListState> = {
  setAniListData(state, payload: IAniListMediaListCollection) {
    state._aniListData = payload;
  },
  setLatestActivities(state, payload: IAniListActivity[]) {
    state._latestActivities = payload;
  },
  setCurrentMediaTitle(state, payload: string) {
    state._currentMediaTitle = payload;
  },
};

const actions: ActionTree<AniListState, RootState> = {
  async setAniListData({ commit }, payload: IAniListMediaListCollection): Promise<void> {
    commit('setAniListData', payload);

    return Promise.resolve();
  },
  async setLatestActivities({ commit }, payload: IAniListActivity[]): Promise<void> {
    commit('setLatestActivities', payload);

    return Promise.resolve();
  },
  async setCurrentMediaTitle({ commit }, payload: string) {
    commit('setCurrentMediaTitle', payload);

    return Promise.resolve();
  },
  async resetAllData({ commit }): Promise<void> {
    commit('setAniListData', { lists: [] });
    commit('setLatestActivities', []);
    commit('setCurrentMediaTitle', '');

    return Promise.resolve();
  },
};

const module: Module<AniListState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

export default module;
