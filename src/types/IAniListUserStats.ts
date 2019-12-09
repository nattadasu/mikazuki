import { IAniListActivityHistory } from '@/types/IAniListActivityHistory';

export interface IAniListUserStats {
  /**
   * @var {number} watchedTime contains the amount of minutes the user has watched anime
   */
  watchedTime: number;

  activityHistory: IAniListActivityHistory[];
}
