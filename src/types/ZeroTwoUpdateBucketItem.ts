import { AniListListStatus } from './AniListListStatus';

export interface ZeroTwoUpdateBucketItem {
  id: number | null;
  mediaId: number | null;
  title: string | null;
  status: AniListListStatus | null;
  progress: number | null;
  score: number | null;
  changeFrom: number;
}
