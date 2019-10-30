import { userStore, aniListStore } from '@/store';
import { API } from '@/plugins/AniList/index';
import { IAniListUser, AniListType } from '@/types';

export default {
  async refreshAniListData(): Promise<void> {
    if (!userStore.session.accessToken) {
      return;
    }

    try {
      const user = await API.getUser();

      const userName = (user as IAniListUser).name;
      const userList = await API.getUserList(userName, AniListType.ANIME);

      const userId = (user as IAniListUser).id;
      const latestActivities = await API.getLatestActivities(userId, { page: 1, perPage: 10, isFollowing: true });

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
      const userList = await API.getUserList(userName, AniListType.ANIME);

      if (userList) {
        await aniListStore.setAniListData(userList);
      }
    } catch (error) {
      //
    }
  },
};
