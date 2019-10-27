import { IAniListMediaTitle } from './IAniListMediaTitle';
import { IAniListMediaDate } from './IAniListMediaDate';
import { AniListSeason } from './AniListSeason';
import { AniListMediaStatus } from './AniListMediaStatus';
import { IAniListMediaStudio, IAniListNextAiringEpisode } from '.';
import { AniListFormat } from './AniListFormat';
import { AniListType } from './AniListType';
import { IAniListCoverImage } from './IAniListCoverImage';
import { IAniListStreamingEpisode } from './IAniListStreamingEpisode';

export interface IAniListMedia {
  /**
   * @var {number} id contains the media's ID
   */
  id: number;
  /**
   * @var {IAniListMediaTitle} title contains the different media's title
   */
  title: IAniListMediaTitle;
  /**
   * @var {string} description contains the description of the media
   */
  description: string;
  /**
   * @var {IAniListMediaDate} startDate contains the start date of the media's first release
   */
  startDate: IAniListMediaDate;
  /**
   * @var {IAniListMediaDate} endDate contains the last official release date of the media
   */
  endDate: IAniListMediaDate;
  /**
   * @var {AniListSeason} season contains the media's season
   */
  season: AniListSeason;
  /**
   * @var {AniListMediaStatus} status contains the media's status
   */
  status: AniListMediaStatus;
  /**
   * @var {string} studio contains the media's studio name
   */
  studios: IAniListMediaStudio;
  /**
   * @var {AniListFormat} format contains the media's release format
   */
  format: AniListFormat;
  /**
   * @var {AniListType} type contains the media's type
   */
  type: AniListType;
  /**
   * @var {number} episodes contains the amount of episodes
   */
  episodes: number;
  /**
   * @var {boolean} isLicensed indicates if the media is licensed (in America)
   */
  isLicensed: boolean;
  /**
   * @var {number} updatedAt contains the timestamp of the last update
   */
  updatedAt: number;
  /**
   * @var {IAniListCoverImage} coverImage contains the urls of the media's cover image
   */
  coverImage: IAniListCoverImage;
  /**
   * @var {string | null} bannerImage contains the url of the media's banner image
   */
  bannerImage: string | null;
  /**
   * @var {string[]} genres contains the media's genres
   */
  genres: string[];
  /**
   * @var {string[]} synonyms contains all the synonyms of the media's title
   */
  synonyms: string[];
  /**
   * @var {number} averageScore contains the media's average score
   */
  averageScore: number;
  /**
   * @var {number} favourites contains the number of people that marked the media as favourite
   */
  favourites: number;
  /**
   * @var {boolean} isAdult indicates if the media is only suited for adults (18+)
   */
  isAdult: boolean;
  /**
   * @var {IAniListNextAiringEpisode} nextAiringEpisode contains information about the next airing episode
   */
  nextAiringEpisode: IAniListNextAiringEpisode;
  /**
   * @var {IAniListStreamingEpisode[]} streamingEpisodes contains information about all streaming episodes
   */
  streamingEpisodes: IAniListStreamingEpisode[];
}
