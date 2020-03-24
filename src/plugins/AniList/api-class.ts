import axios from './connection';
import store from '@/store';

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
  AniListListStatus,
  IAniListSearchResult,
  IAniListActivity,
  IAniListMediaDate,
  IAniListUserStats,
  IAniListUserStatistics,
} from '@/types';
// #endregion

// #region Queries
import getAnimeInfo from './queries/getAnimeInfo.graphql';
import getListEntry from './queries/getListEntry.graphql';
import getUserList from './queries/getUserList.graphql';
import getUser from './queries/getUser.graphql';
import getLatestActivities from './queries/getLatestActivities.graphql';
import getUserStatistics from './queries/getUserStatistics.graphql';
import getSeasonPreview from './queries/getSeasonPreview.graphql';
import searchAnime from './queries/searchAnime.graphql';
// #endregion

// #region Mutations
import addEntry from './mutations/addEntry.graphql';
import updateEntry from './mutations/updateEntry.graphql';
import removeEntry from './mutations/removeEntry.graphql';
// #endregion

// #region Responses
import {
  UserListResponse,
  UserResponse,
  SeasonPreviewResponse,
  MediaResponse,
  SearchResponse,
  LatestActivitiesResponse,
} from './responses';
// #endregion

interface SearchFilters {
  isAdult: string;
  listStatus: AniListListStatus[];
  genres: string[];
}

interface ActivitiesParams {
  page: number;
  perPage: number;
  isFollowing?: boolean;
}

interface AddEntryParams {
  mediaId: number;
  status: AniListListStatus;
  score?: number;
  progress?: number;
}

interface UpdateEntryParams {
  entryId: number;
  progress: number;
  score?: number;
  status?: AniListListStatus;
  startedAt?: IAniListMediaDate;
  completedAt?: IAniListMediaDate;
}

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

  public async getLatestActivities(
    userId: number,
    { page, perPage, isFollowing }: ActivitiesParams = { page: 1, perPage: 10, isFollowing: true }
  ): Promise<IAniListActivity[]> {
    const response = await axios.post<LatestActivitiesResponse>('/', {
      query: getLatestActivities,
      variables: {
        userId,
        page,
        perPage,
        isFollowing,
      },
    });

    return response.page.activities;
  }

  public async getUserStatistics(): Promise<{ stats: IAniListUserStats; statistics: IAniListUserStatistics }> {
    const response = await axios.post<UserResponse>('/', {
      query: getUserStatistics,
    });

    return {
      stats: response.user.stats,
      statistics: response.user.statistics,
    };
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
    const { id: userId } = store.state.userSettings._session.user;

    const response = await axios.post<MediaResponse<IAniListEntry>>('/', {
      query: getListEntry,
      variables: { mediaId, userId },
    });

    return response.media;
  }

  public async searchAnime(query: string, filters: SearchFilters): Promise<IAniListSearchResult[]> {
    const genres = filters.genres.length ? filters.genres : undefined;
    const onList = !!filters.listStatus.length || undefined;
    const isAdult = filters.isAdult === 'both' ? undefined : filters.isAdult === 'adult';

    const params = {
      query,
      type: AniListType.ANIME,
      genres,
      onList,
      isAdult,
    };

    const response = await axios.post<SearchResponse>('/', {
      query: searchAnime,
      variables: params,
    });

    const searchResults = response.page.media;

    if (filters.listStatus.length) {
      return searchResults.filter((element) => {
        if (!element.mediaListEntry) {
          return false;
        }

        return filters.listStatus.some((filter) => filter === element.mediaListEntry.status);
      });
    }

    return searchResults;
  }

  public async addEntry({ mediaId, status, score, progress }: AddEntryParams): Promise<IAniListEntry> {
    const response = await axios.post<MediaResponse<IAniListEntry>>('/', {
      query: addEntry,
      variables: {
        mediaId,
        status,
        score,
        progress,
      },
    });

    return response.media;
  }

  public async updateEntry({
    entryId,
    progress,
    score,
    status,
    startedAt,
    completedAt,
  }: UpdateEntryParams): Promise<void> {
    await axios.post('/', {
      query: updateEntry,
      variables: {
        entryId,
        progress,
        score,
        status,
        startedAt,
        completedAt,
      },
    });
  }

  public async removeEntry(entryId: number): Promise<void> {
    await axios.post('/', {
      query: removeEntry,
      variables: { entryId },
    });
  }
}
