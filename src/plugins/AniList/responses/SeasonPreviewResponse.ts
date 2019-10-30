import { IAniListSeasonPreviewMedia } from '@/types';

export interface SeasonPreviewResponse {
  page: {
    media: IAniListSeasonPreviewMedia[];
  };
}
