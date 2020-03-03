import { action, mutation, createModule } from 'vuex-class-component';
import { IAniListActivity, IAniListMediaListCollection, ZeroTwoUpdateBucketItem } from '@/types';

/**
 * @module AniListStore
 * @description contains the user's data that is connected to AniList
 */

const VuexModule = createModule({
  strict: false,
});

export default class AniListStore extends VuexModule {
  /**
   * @private
   * @var {IAniListMediaListCollection} _aniListData contains the logged in user's lists
   */
  private _aniListData: IAniListMediaListCollection = { lists: [] };

  /**
   * @private
   * @var {IAniListActivity[]} _latestActivities contains the current user's latest activities
   */
  private _latestActivities: IAniListActivity[] = [];

  /**
   * @private
   * @var {string | null} _currentMediaTitle contains the title of the currently viewing media
   */
  private _currentMediaTitle: string | null = null;

  /**
   * @private
   * @var {ZeroTwoUpdateBucket} _updateBucket contains all updates that should be triggered and sent to AniList
   */
  private _updateBucket: ZeroTwoUpdateBucketItem[] = [];

  /**
   * @getter
   * @method aniListData
   * @returns {IAniListMediaListCollection} the current user's AniList data
   */
  public get aniListData(): IAniListMediaListCollection {
    return this._aniListData;
  }

  /**
   * @getter
   * @method latestActivities
   * @returns {IAniListActivity[]} the current user's latest activities
   */
  public get latestActivities(): IAniListActivity[] {
    return this._latestActivities;
  }

  public get currentMediaTitle(): string | null {
    return this._currentMediaTitle;
  }

  public get updateBucket(): ZeroTwoUpdateBucketItem[] {
    return this._updateBucket;
  }

  @action public async setAniListData(data: IAniListMediaListCollection): Promise<void> {
    this._setAniListData(data);
  }

  @action public async setLatestActivities(data: IAniListActivity[]): Promise<void> {
    this._setLatestActivities(data);
  }

  @action public async setCurrentMediaTitle(title: string | null): Promise<void> {
    this._setCurrentMediaTitle(title);
  }

  @action public async addToUpdateBucket(item: ZeroTwoUpdateBucketItem): Promise<void> {
    this._addToUpdateBucket(item);
  }

  @action public async removeFromUpdateBucket(item: ZeroTwoUpdateBucketItem): Promise<void> {
    this._removeFromUpdateBucket(item);
  }

  @action public async setUpdateBucket(items: ZeroTwoUpdateBucketItem[]): Promise<void> {
    this._setUpdateBucket(items);
  }

  @action public async resetAllData(): Promise<void> {
    this._setAniListData({ lists: [] });
    this._setUpdateBucket([]);
    this._setLatestActivities([]);
    this._setCurrentMediaTitle(null);
  }

  /**
   * @protected
   * @mutation
   * @method _setAniListData
   * @param {IAniListMediaListCollection} data
   * @description sets the user's complete list data
   * @returns {void}
   */
  @mutation protected _setAniListData(data: IAniListMediaListCollection): void {
    this._aniListData = data;
  }

  @mutation protected _setLatestActivities(data: IAniListActivity[]): void {
    this._latestActivities = data;
  }

  @mutation protected _setCurrentMediaTitle(title: string | null): void {
    this._currentMediaTitle = title;
  }

  @mutation protected _setUpdateBucket(items: ZeroTwoUpdateBucketItem[]): void {
    this._updateBucket = items;
  }

  @mutation protected _addToUpdateBucket(item: ZeroTwoUpdateBucketItem): void {
    this._updateBucket.push(item);
  }

  @mutation protected _removeFromUpdateBucket(item: ZeroTwoUpdateBucketItem): void {
    const idx = this._updateBucket.findIndex((_item) => _item.id === item.id);

    if (idx !== -1) {
      this._updateBucket.splice(idx, 1);
    }
  }
}
