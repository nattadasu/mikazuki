import { IAniListSeasonPreviewMedia } from '@/modules/AniList/types';

export interface SeasonPreviewResponse {
  page: {
    media: IAniListSeasonPreviewMedia[];
  };
}
