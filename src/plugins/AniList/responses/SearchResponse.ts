import { IAniListSearchResult } from '@/types';

export interface SearchResponse {
  page: {
    media: IAniListSearchResult[];
  };
}
