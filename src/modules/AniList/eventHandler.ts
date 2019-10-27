import { userStore, aniListStore } from '@/store';
import { API as NewAPI } from '@/plugins/AniList';
import { IAniListUser, AniListType } from './types';

export default {
  async refreshAniListData(): Promise<void> {
    if (!userStore.session.accessToken) {
      return;
    }

    try {
      const user = await NewAPI.getUser();

      const userName = (user as IAniListUser).name;
      const userList = await NewAPI.getUserList(userName, AniListType.ANIME);

      const userId = (user as IAniListUser).id;
      const latestActivities = await NewAPI.getLatestActivities(userId, { page: 1, perPage: 10, isFollowing: true });

      if (userList && user && latestActivities) {
        await userStore.setUser(user);
        await aniListStore.setAniListData(userList);
        await aniListStore.setLatestActivities(latestActivities);
      }
    } catch (error) {
      //
    }
  },

  async refreshLists(): Promise<void> {
    if (!userStore.session.accessToken) {
      return;
    }

    try {
      const { user } = userStore.session;
      const userName = (user as IAniListUser).name;
      const userList = await NewAPI.getUserList(userName, AniListType.ANIME);

      if (userList) {
        aniListStore.setAniListData(userList);
      }
    } catch (error) {
      //
    }
  },
};
