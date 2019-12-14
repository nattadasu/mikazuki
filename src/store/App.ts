import { action, mutation, createModule } from 'vuex-class-component';

/**
 * @module AppStore This store contains general data about the app.
 */

const VuexModule = createModule({
  strict: false,
});

export default class AppStore extends VuexModule {
  /**
   * @private
   * @var {string} _locale contains the locale string
   */
  private _locale?: string = process.env.VUE_APP_I18N_FALLBACK_LOCALE;

  /**
   * @private
   * @var {boolean} _darkMode toggles the dark or light mode
   * @default true
   */
  private _darkMode: boolean = true;

  /**
   * @private
   * @var {boolean} _loading toggles the loading state
   * @default false
   */
  private _loading: boolean = false;

  /**
   * @method AppStore.language
   * @returns the current language string or undefined, if not yet set.
   */
  public get language(): string | undefined {
    return this._locale;
  }

  /**
   * @method AppStore.darkMode
   * @returns {boolean} the current dark mode setting state
   */
  public get darkMode(): boolean {
    return this._darkMode;
  }

  /**
   * @method AppStore.isLoading
   * @returns {boolean} the current loading state
   */
  public get isLoading(): boolean {
    return this._loading;
  }

  /**
   * @async
   * @action
   * @method setLanguage
   * @param {string} language the language string
   * @returns {Promise<void>}
   */
  @action public async setLanguage(language: string): Promise<void> {
    this._setLanguage(language);
  }

  /**
   * @async
   * @action
   * @method setDarkMode
   * @param {boolean} state contains the state if dark mode is to be enabled or not
   * @returns {Promise<void>}
   */
  @action public async setDarkMode(state: boolean): Promise<void> {
    this._setDarkMode(state);
  }

  @action public async setLoadingState(state: boolean): Promise<void> {
    this._setLoadingState(state);
  }

  /**
   * @protected
   * @method _setLanguage
   * @description Sets the app's locale to set language
   * @param {string} language
   */
  @mutation protected _setLanguage(language: string) {
    this._locale = language;
  }

  /**
   * @protected
   * @method _setDarkMode
   * @description Sets the app's dark mode to on or off
   * @param {boolean} state
   */
  @mutation protected _setDarkMode(state: boolean) {
    this._darkMode = state;
  }

  @mutation protected _setLoadingState(state: boolean) {
    this._loading = state;
  }
}
