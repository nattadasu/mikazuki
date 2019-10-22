import { IAniListMedia, IAniListEntry } from '@/modules/AniList/types';

export interface MediaResponse<T = IAniListMedia | IAniListEntry> {
  media: T;
}
