import { IAniListUserAvatar } from './IAniListUserAvatar';
import { IAniListUserMediaListOptions } from './IAniListUserMediaListOptions';
import { IAniListUserOptions } from '.';
import { IAniListUserStats } from './IAniListUserStats';

export interface IAniListUser {
  /**
   * @var {number} id contains the ID of the user
   */
  id: number;
  /**
   * @var {string} name contains the user's name
   */
  name: string;
  /**
   * @var {IAniListUserAvatar} avatar contains the user's avatar information
   */
  avatar: IAniListUserAvatar;
  /**
   * @var {string} bannerImage contains the URL to the user's banner image
   */
  bannerImage: string;
  /**
   * @var {IAniListUserMediaListOptions} mediaListOptions contains the user's media list options
   */
  mediaListOptions: IAniListUserMediaListOptions;
  /**
   * @var {IAniListUserOptions} options contains the user's general settings
   */
  options: IAniListUserOptions;
  /**
   * @var {IAniListUserStats} stats contains the user's stats information
   */
  stats: IAniListUserStats;
}
