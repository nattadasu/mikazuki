import { AniListListStatus, IAniListMedia } from './index';

export interface IAniListEntry {
  /**
   * @var {number} id contains the ID of the list entry
   */
  id: number;
  /**
   * @var {number} progress contains the amount of progress (episodes/chapters) consumed
   */
  progress: number;
  /**
   * @var {number} score contains the user's given score
   */
  score: number;
  /**
   * @var {AniListListStatus} status contains the list entry's status
   */
  status: AniListListStatus;
  /**
   * @var {number} updatedAt contains the timestamp of the last update
   */
  updatedAt: number;
  /**
   * @var {IAniListMedia} media contains the list entry's media information
   */
  media: IAniListMedia;
}
