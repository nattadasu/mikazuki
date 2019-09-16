import { userStore, aniListStore } from '@/store';
import Log from '@/log';
import API from './API';
import { IAniListUser, AniListType } from './types';

export default {
  async refreshAniListData(): Promise<void> {
    if (!userStore.session.accessToken) {
      return;
    }

    try {
      const { accessToken } = userStore.session;
      const user = await API.getUser(accessToken);

      const userName = (user as IAniListUser).name;
      const userList = await API.getUserList(userName, AniListType.ANIME, accessToken);

      const userId = (user as IAniListUser).id;
      const latestActivities = await API.getLatestActivities(userId, 0, 10);

      if (userList && user && latestActivities) {
        await userStore.setUser(user);
        await aniListStore.setAniListData(userList);
        await aniListStore.setLatestActivities(latestActivities);
      }
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'store', 'refreshAniListData'], error);
    }
  },

  async refreshLists(): Promise<void> {
    if (!userStore.session.accessToken) {
      return;
    }

    try {
      const { accessToken, user } = userStore.session;
      const userName = (user as IAniListUser).name;
      const userList = await API.getUserList(userName, AniListType.ANIME, accessToken);

      if (userList) {
        aniListStore.setAniListData(userList);
      }
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'store', 'refreshLists'], error);
    }
  },
};
