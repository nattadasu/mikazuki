import { IAniListMediaTitle } from './IAniListMediaTitle';
import { IAniListMediaDate } from './IAniListMediaDate';
import { IAniListStreamingEpisode } from './index';
import { IAniListCoverImage } from './IAniListCoverImage';
import { IAniListNextAiringEpisode } from './IAniListNextAiringEpisode';
import { IAniListMediaStudio } from './IAniListMediaStudio';

export interface IAniListSeasonPreviewMedia {
  /**
   * @var {number} id contains the AniList media id
   */
  id: number;
  /**
   * @var {IAniListMediaTitle} title contains the AniList media title
   */
  title: IAniListMediaTitle;
  /**
   * @var {IAniListMediaDate} startDate contains the media's start date
   */
  startDate: IAniListMediaDate;
  /**
   * @var {number} episodes contains the amount of episodes the media is going to have.
   */
  episodes: number;
  /**
   * @var {IAniListStreamingEpisode[]} streamingEpisodes contains info about streaming services
   */
  streamingEpisodes: IAniListStreamingEpisode[];
  /**
   * @var {IAniListCoverImage} coverImage contains the links to media's cover images
   */
  coverImage: IAniListCoverImage;
  /**
   * @var {string | null} bannerImage contains the link to a banner image
   */
  bannerImage: string | null;
  /**
   * @var {string[]} genres contains the media's genres
   */
  genres: string[];
  /**
   * @var {IAniListNextAiringEpisode} nextAiringEpisode contains info about the next airing episode
   */
  nextAiringEpisode: IAniListNextAiringEpisode;
  /**
   * @var {boolean} isAdult determines if the media is either for adults or not
   */
  isAdult: boolean;
  /**
   * @var {boolean} isLocked determines if the media can be added to the list
   */
  isLocked: boolean;
  /**
   * @var {string} description contains the media's description
   */
  description: string;
  /**
   * @var {IAniListMediaStudio} studios contains the media's studios
   */
  studios: IAniListMediaStudio;
}
