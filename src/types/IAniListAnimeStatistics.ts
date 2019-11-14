import { IAniListGenreStatistic } from './IAniListGenreStatistic';

export interface IAniListAnimeStatistics {
  count: number;
  meanScore: number;
  standardDeviation: number;
  minutesWatched: number;
  episodesWatched: number;
  genres: IAniListGenreStatistic[];
}
