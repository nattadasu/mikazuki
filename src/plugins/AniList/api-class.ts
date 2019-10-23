import { Location } from 'graphql';
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
  AniListListStatus,
  IAniListSearchResult,
} from '@/modules/AniList/types';
// #endregion

// #region Queries
import getAnimeInfo from './queries/getAnimeInfo.graphql';
import getListEntry from './queries/getListEntry.graphql';
import getUserList from './queries/getUserList.graphql';
import getUser from './queries/getUser.graphql';
import getSeasonPreview from './queries/getSeasonPreview.graphql';
import searchAnime from './queries/searchAnime.graphql';
// #endregion

// #region Responses
import {
  UserListResponse, UserResponse, SeasonPreviewResponse, MediaResponse, SearchResponse
} from './responses';
// #endregion

interface SearchFilters {
  isAdult: string;
  listStatus: AniListListStatus[];
  genres: string[];
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

  public async searchAnime(query: string, filters: SearchFilters): Promise<IAniListSearchResult[]> {
    const genres = filters.genres.length ? filters.genres : null;
    const onList = !!filters.listStatus.length;
    const { isAdult } = filters;

    const mediaQueryDeclaration = [
      '$query: String!',
      '$type: MediaType!',
      '$genres: [String]',
    ];
    const mediaQueryDefinition = [
      'search: $query',
      'type: $type',
      'genre_in: $genres',
    ];
    const mediaQueryParameters: {
      query: string,
      type: string,
      genres: string[] | null,
      onList?: boolean,
      isAdult?: boolean,
    } = {
      query,
      type: AniListType.ANIME,
      genres,
    };

    if (onList) {
      mediaQueryDeclaration.push('$onList: Boolean');
      mediaQueryDefinition.push('onList: $onList');
      mediaQueryParameters.onList = onList;
    }

    if (isAdult !== 'both') {
      mediaQueryDeclaration.push('$isAdult: Boolean');
      mediaQueryDefinition.push('isAdult: $isAdult');
      mediaQueryParameters.isAdult = isAdult === 'adult';
    }

    const searchQuery = (searchAnime.loc as Location).source.body
      .replace('query searchAnime', `query searchAnime(${mediaQueryDeclaration.join(', ')})`)
      .replace('media {', `media(${mediaQueryDefinition.join(', ')}) {`);

    const response = await axios.post<SearchResponse>('/', {
      query: searchQuery,
      variables: mediaQueryParameters,
    });

    const searchResults = response.page.media;

    if (filters.listStatus.length) {
      const results = searchResults.filter((element) => {
        if (!element.mediaListEntry) {
          return false;
        }

        return filters.listStatus.some(filter => filter === element.mediaListEntry.status);
      });

      return results;
    }

    return searchResults;
  }
}
