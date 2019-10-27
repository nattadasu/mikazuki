import { AniListSeason, IAniListSeasonPreviewMedia } from '.';

export interface IAniListSeasonPreview {
  season: AniListSeason;
  seasonYear: number;
  media: IAniListSeasonPreviewMedia[];
}
