import { IAniListActivity } from '@/types';

export interface LatestActivitiesResponse<T = IAniListActivity> {
  page: {
    activities: T[];
  };
}
