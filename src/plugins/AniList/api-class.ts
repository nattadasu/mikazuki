import axios from './connection';

// #region AniList Types
import {
  AniListSeason,
  AniListType,
  IAniListMediaListCollection,
  IAniListSeasonPreview,
  IAniListSeasonPreviewMedia,
  IAniListUser,
  IAniListMedia,
  IAniListEntry,
} from '@/modules/AniList/types';
// #endregion

// #region Queries
import getAnimeInfo from './queries/getAnimeInfo.graphql';
import getListEntry from './queries/getListEntry.graphql';
import getUserList from './queries/getUserList.graphql';
import getUser from './queries/getUser.graphql';
import getSeasonPreview from './queries/getSeasonPreview.graphql';
// #endregion

// #region Responses
import {
  UserListResponse, UserResponse, SeasonPreviewResponse, MediaResponse
} from './responses';
// #endregion

export default class AniListAPI {
  public async getUserList(userName: string, type: AniListType): Promise<IAniListMediaListCollection> {
    const response = await axios.post<UserListResponse>('/', {
      query: getUserList,
      variables: {
        userName,
        type,
      },
    });

    return response.list;
  }

  public async getUser(): Promise<IAniListUser> {
    const response = await axios.post<UserResponse>('/', { query: getUser });

    return response.user;
  }

  public async getSeasonPreview(seasonYear: number, season: AniListSeason): Promise<IAniListSeasonPreview> {
    const mediaItems: IAniListSeasonPreviewMedia[] = [];
    let page = 1;
    let tmp = true;

    while (tmp) {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.post<SeasonPreviewResponse>('/', {
        query: getSeasonPreview,
        variables: {
          season,
          seasonYear,
          page,
        },
      });

      const { media } = response.page;

      if (!media.length || media.length < 50) {
        tmp = false;
      }

      mediaItems.push(...media);
      page += 1;
    }

    return {
      season,
      seasonYear,
      media: mediaItems,
    };
  }

  public async getAnimeInfo(id: number): Promise<IAniListMedia> {
    const response = await axios.post<MediaResponse<IAniListMedia>>('/', {
      query: getAnimeInfo,
      variables: { id },
    });

    return response.media;
  }

  public async getListEntryByMediaId(mediaId: number): Promise<IAniListEntry> {
    const response = await axios.post<MediaResponse<IAniListEntry>>('/', {
      query: getListEntry,
      variables: { mediaId },
    });

    return response.media;
  }
}
