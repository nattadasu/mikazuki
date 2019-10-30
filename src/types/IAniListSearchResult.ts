import { IAniListMediaTitle } from './IAniListMediaTitle';
import { IAniListCoverImage } from './IAniListCoverImage';
import { IAniListEntry } from './IAniListEntry';
import { IAniListNextAiringEpisode } from './IAniListNextAiringEpisode';
import { IAniListMediaStudio } from './index';

export interface IAniListSearchResult {
  id: number;
  title: IAniListMediaTitle;
  averageScore: number;
  coverImage: IAniListCoverImage;
  episodes: number;
  isAdult: boolean;
  mediaListEntry: IAniListEntry;
  nextAiringEpisode: IAniListNextAiringEpisode;
  studios: IAniListMediaStudio;
}
