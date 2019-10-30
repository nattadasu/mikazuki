import { AniListSeason, IAniListSeasonPreviewMedia } from './index';

export interface IAniListSeasonPreview {
  season: AniListSeason;
  seasonYear: number;
  media: IAniListSeasonPreviewMedia[];
}
