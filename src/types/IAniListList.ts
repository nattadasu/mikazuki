import { IAniListEntry } from './IAniListEntry';
import { AniListListStatus } from './AniListListStatus';

export interface IAniListList {
  /**
   * @var {IAniListEntry[]} entries contains the list's user entries
   */
  entries: IAniListEntry[];
  /**
   * @var {AniListListStatus} status contains the list's status
   */
  status: AniListListStatus;
}
