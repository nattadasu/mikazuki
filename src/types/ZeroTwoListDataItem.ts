import { IAniListEntry } from './IAniListEntry';
import { IAniListMedia } from './IAniListMedia';

export interface ZeroTwoListDataItem {
  /**
   * @var {IAniListEntry} entry contains the whole User's entry object
   */
  entry: IAniListEntry;

  /**
   * @var {IAniListMedia} media contains the media information
   */
  media: IAniListMedia;

  /**
   * @var {Date} startDate contains the media's starting date as a Date object
   */
  startDate?: Date;

  /**
   * @var {string} image contains the link to the media's extraLarge image
   */
  image?: string;
}
