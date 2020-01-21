import { action, mutation, createModule } from 'vuex-class-component';
import { IAniListSession, AniListScoreFormat, IAniListUser } from '@/types';

const VuexModule = createModule({
  strict: false,
});

export default class UserSettings extends VuexModule {
  /**
   * @private
   * @var {number} _refreshRate contains the amount of minutes until the app refreshes the user's lists
   */
  private _refreshRate: number = 15;

  /**
   * @private
   * @var {number} _listItemAmount contains the amount of items that should be shown initially when navigating to a list route
   */
  private _listItemAmount: number = 50;

  /**
   * @private
   * @var {IAniListSession} _session contains the user's session
   */
  private _session: IAniListSession = {
    accessToken: '',
    user: {
      avatar: {
        medium: '',
        large: '',
      },
      bannerImage: '',
      id: -1,
      mediaListOptions: {
        scoreFormat: AniListScoreFormat.POINT_100,
      },
      name: '',
      stats: {
        watchedTime: 0,
        activityHistory: [],
      },
      options: {
        displayAdultContent: false,
      },
      statistics: {
        anime: {
          count: 0,
          episodesWatched: 0,
          meanScore: 0,
          minutesWatched: 0,
          standardDeviation: 0,
          genres: [],
        },
        manga: {
          chaptersRead: 0,
          count: 0,
          meanScore: 0,
          standardDeviation: 0,
          volumesRead: 0,
        },
      },
    },
  };

  /**
   * @method refreshRate
   * @returns {number} the current user's set refresh rate (in minutes)
   */
  public get refreshRate(): number {
    return this._refreshRate;
  }

  public get listItemAmount(): number {
    return this._listItemAmount;
  }

  /**
   * @method session
   * @returns {IAniListSession} the current user's AniList session
   */
  public get session(): IAniListSession {
    return this._session;
  }

  public get accessToken(): string {
    return this._session.accessToken;
  }

  /**
   * @method isAuthenticated
   * @returns {boolean} is the current user logged in
   */
  public get isAuthenticated(): boolean {
    return !!this._session.accessToken;
  }

  public get allowAdultContent(): boolean {
    return this._session.user.options.displayAdultContent;
  }

  @action public async logout(): Promise<void> {
    await this.$store.dispatch('setCurrentMediaTitle', '');
    await this.setSession('');
    await this.setRefreshRate(15);

    await this.$store.dispatch('resetAllData');
  }

  /**
   * @action
   * @async
   * @method setSession
   * @param {string} accessToken the access token
   * @description calls the {protected} mutation method _setSession
   * @returns {Promise<void>}
   */
  @action public async setSession(accessToken: string): Promise<void> {
    this._setSession(accessToken);
  }

  @action public async setUser(data: IAniListUser): Promise<void> {
    this._setUser(data);
  }

  @action public async setRefreshRate(refreshRate: number): Promise<void> {
    this._setRefreshRate(refreshRate);
  }

  @action public async setListItemAmount(value: number): Promise<void> {
    this._setListItemAmount(value);
  }

  /**
   * @protected
   * @method _setSession
   * @param {string} accessToken the access token
   * @description sets the session's access token
   * @returns {void}
   */
  @mutation protected _setSession(accessToken: string): void {
    this._session.accessToken = accessToken;
  }

  /**
   * @protected
   * @method _setUser
   * @param {IAniListUser} data the user data of the AniList user
   * @description sets the session's user data
   * @returns {void}
   */
  @mutation protected _setUser(data: IAniListUser): void {
    this._session.user = data;
  }

  @mutation protected _setRefreshRate(refreshRate: number): void {
    this._refreshRate = refreshRate;
  }

  @mutation protected _setListItemAmount(value: number): void {
    this._listItemAmount = value;
  }
}
