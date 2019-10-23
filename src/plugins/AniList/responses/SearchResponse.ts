import { IAniListSearchResult } from '@/modules/AniList/types';

export interface SearchResponse {
  page: {
    media: IAniListSearchResult[];
  };
}
