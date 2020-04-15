import store from '@/store';
import { API } from '@/plugins/AniList/index';
import { IAniListUser, AniListType } from '@/types';

export default {
  async refreshAniListData(): Promise<void> {
    if (!store.state.userSettings._session.accessToken) {
      return;
    }

    try {
      store.commit('app/setLoadingState', true);
      const user = await API.getUser();
      const { stats, statistics } = await API.getUserStatistics();
      user.statistics = statistics;
      user.stats.activityHistory = stats.activityHistory;

      const userName = (user as IAniListUser).name;
      const userList = await API.getUserList(userName, AniListType.ANIME);

      const userId = (user as IAniListUser).id;
      const latestActivities = await API.getLatestActivities(userId, { page: 1, perPage: 10, isFollowing: true });

      if (userList && user && latestActivities) {
        store.commit('userSettings/setUser', user);
        store.commit('aniList/setAniListData', userList);
        store.commit('aniList/setLatestActivities', latestActivities);
      }
    } catch (error) {
      //
    } finally {
      store.commit('app/setLoadingState', false);
    }
  },

  async refreshLists(): Promise<void> {
    if (!store.state.userSettings._session.accessToken) {
      return;
    }

    try {
      store.commit('app/setLoadingState', true);
      const { user } = store.state.userSettings._session;
      const userName = (user as IAniListUser).name;
      const userList = await API.getUserList(userName, AniListType.ANIME);

      if (userList) {
        store.commit('aniList/setAniListData', userList);
      }
    } catch (error) {
      //
    } finally {
      store.commit('app/setLoadingState', false);
    }
  },
};
