import { IAniListMedia, IAniListEntry } from '@/types';

export interface MediaResponse<T = IAniListMedia | IAniListEntry> {
  media: T;
}
