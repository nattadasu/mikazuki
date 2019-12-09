import { IAniListAnimeStatistics } from '@/types/IAniListAnimeStatistics';
import { IAniListMangaStatistics } from '@/types/IAniListMangaStatistics';

export interface IAniListUserStatistics {
  anime: IAniListAnimeStatistics;
  manga: IAniListMangaStatistics;
}
