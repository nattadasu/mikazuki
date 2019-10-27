import { IAniListActivity } from '@/modules/AniList/types';

export interface LatestActivitiesResponse<T = IAniListActivity> {
  page: {
    activities: T[];
  };
}
