import {
  action, getter, Module, mutation, VuexModule,
} from 'vuex-class-component';
import { IAniListSession, AniListScoreFormat, IAniListUser } from '@/modules/AniList/types';
import eventHandler from '@/modules/AniList/eventHandler';

/**
 * @description This is a testing module to get to know Vuex in Typescript better.
 */
@Module()
export class UserSettings extends VuexModule {
  /**
   * @private
   * @var {number} _refreshRate contains the amount of minutes until the app refreshes the user's lists
   */
  private _refreshRate: number = 15;

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
      },
      options: {
        displayAdultContent: false,
      },
    },
  };

  /**
   * @private
   * @var {number} _timeUntilRefresh contains the amount of seconds until the next refresh
   */
  private _timeUntilRefresh: number = 0;

  /**
   * @private
   * @var {NodeJS.Timeout | null} _refreshTimer contains the timer id for the AniList timer
   */
  private _refreshTimer: NodeJS.Timeout | null = null;

  /**
   * @getter
   * @method refreshRate
   * @returns {number} the current user's set refresh rate (in minutes)
   */
  @getter
  public get refreshRate(): number {
    return this._refreshRate;
  }

  /**
   * @getter
   * @method session
   * @returns {IAniListSession} the current user's AniList session
   */
  @getter
  public get session(): IAniListSession {
    return this._session;
  }

  @getter
  public get accessToken(): string {
    return this._session.accessToken;
  }

  /**
   * @getter
   * @method isAuthenticated
   * @returns {boolean} is the current user logged in
   */
  @getter
  public get isAuthenticated(): boolean {
    return !!this._session.accessToken;
  }

  @getter
  public get timeUntilRefresh(): number {
    return this._timeUntilRefresh;
  }

  @getter
  public get allowAdultContent(): boolean {
    return this._session.user.options.displayAdultContent;
  }

  @action()
  public async logout(): Promise<void> {
    await this.$store.dispatch('setCurrentMediaTitle', '');
    await this.destroyRefreshTimer();
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
  @action()
  public async setSession(accessToken: string): Promise<void> {
    this._setSession(accessToken);
  }

  @action()
  public async setUser(data: IAniListUser): Promise<void> {
    this._setUser(data);
  }

  @action()
  public async setRefreshRate(refreshRate: number): Promise<void> {
    this._setRefreshRate(refreshRate);
  }

  @action()
  public async restartRefreshTimer(): Promise<void> {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
      this._setRefreshTimer(null);
    }

    // Amount of minutes x 60 seconds
    this._setTimeUntilRefresh(this.refreshRate * 60);
    this._setRefreshTimer(setInterval(() => {
      this._setTimeUntilRefresh(this._timeUntilRefresh - 1);
      if (this.timeUntilRefresh <= 0 && this._refreshTimer) {
        clearInterval(this._refreshTimer);
        this._setRefreshTimer(null);

        eventHandler.refreshAniListData()
          .then(() => {
            this.restartRefreshTimer();
          });
      }
    }, 1000));
  }

  @action()
  public async destroyRefreshTimer(): Promise<void> {
    if (this._refreshTimer) {
      clearInterval(this._refreshTimer);
    }
    this._setTimeUntilRefresh(0);
    this._setRefreshTimer(null);
  }

  /**
   * @protected
   * @mutation
   * @method _setSession
   * @param {string} accessToken the access token
   * @description sets the session's access token
   * @returns {void}
   */
  @mutation
  protected _setSession(accessToken: string): void {
    this._session.accessToken = accessToken;
  }

  /**
   * @protected
   * @mutation
   * @method _setUser
   * @param {IAniListUser} data the user data of the AniList user
   * @description sets the session's user data
   * @returns {void}
   */
  @mutation
  protected _setUser(data: IAniListUser): void {
    this._session.user = data;
  }

  @mutation
  protected _setTimeUntilRefresh(time: number): void {
    this._timeUntilRefresh = time;
  }

  @mutation
  protected _setRefreshRate(refreshRate: number): void {
    this._refreshRate = refreshRate;
  }

  @mutation
  protected _setRefreshTimer(timeoutId: NodeJS.Timeout | null): void {
    this._refreshTimer = timeoutId;
  }
}

export const userSettingsModule = UserSettings.ExtractVuexModule(UserSettings);
