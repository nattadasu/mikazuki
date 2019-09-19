<template>
  <v-app id="app">
    <Navigation @navigationDrawerUpdated="navigationDrawer = !navigationDrawer" />
    <router-view :key="$route.path" />
    <ZeroTwoNotifications position="top center" />
    <TopButton />
  </v-app>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { validLanguageCodes } from './i18n';
import { appStore, userStore } from './store';
import aniListEventHandler from '@/modules/AniList/eventHandler';

// Components
import Navigation from '@/components/Navigation.vue';
import TopButton from '@/components/TopButton.vue';
import ZeroTwoNotifications from '@/components/Notifications.vue';

@Component({
  components: {
    Navigation,
    TopButton,
    ZeroTwoNotifications,
  },
})
export default class App extends Vue {
  public get locale(): string | undefined {
    return appStore.language;
  }

  public get darkMode(): boolean {
    return appStore.darkMode;
  }

  public get loggedIntoAniList(): boolean {
    return userStore.isAuthenticated;
  }

  @Watch('loggedIntoAniList')
  public async loggedInStateChanged(newState: boolean) {
    if (newState) {
      await appStore.setLoadingState(true);
      await aniListEventHandler.refreshAniListData();
      await userStore.restartRefreshTimer();
      await appStore.setLoadingState(false);
    } else {
      await userStore.destroyRefreshTimer();
    }
  }

  /**
   * @description Watches changes of locale
   * @see {@link store/App.ts}
   * @param {string | undefined} newLocale
   */
  @Watch('locale')
  public localeChanged(newLocale: string | undefined) {
    const root = document.getElementsByTagName('html')[0];

    this.$i18n.locale = newLocale && validLanguageCodes.includes(newLocale)
      ? newLocale
      : this.$i18n.fallbackLocale;

    this.$vuetify.rtl = this.isRTLLanguage(this.$i18n.locale);
    moment.locale(this.$i18n.locale);
    root.setAttribute('class', `font-face-${this.getLocaleBasedFontFace(this.$i18n.locale)}`);
  }

  @Watch('darkMode')
  public darkModeChanged(newValue: boolean) {
    this.$vuetify.theme.dark = newValue;
  }

  private async created() {
    if (!this.locale) {
      if (window.navigator.languages && window.navigator.languages.length) {
        await appStore.setLanguage(window.navigator.languages[0]);
      } else {
        await appStore.setLanguage(window.navigator.language);
      }
    } else {
      this.$i18n.locale = this.locale;
    }

    const root = document.getElementsByTagName('html')[0];
    root.setAttribute('class', `font-face-${this.getLocaleBasedFontFace(this.$i18n.locale)}`);

    this.$vuetify.theme.dark = appStore.darkMode;
    this.$vuetify.rtl = this.isRTLLanguage(this.$i18n.locale);

    moment.locale(this.$i18n.locale);

    if (userStore.isAuthenticated) {
      await appStore.setLoadingState(true);
      await aniListEventHandler.refreshAniListData();
      await userStore.restartRefreshTimer();
      await appStore.setLoadingState(false);
    }
  }

  private async beforeDestroy() {
    await userStore.destroyRefreshTimer();
  }

  private getLocaleBasedFontFace(locale: string): string {
    let fontFace = '';

    switch (locale) {
      case 'ja': // Japanese
        fontFace = 'ja';
        break;
      case 'zh_CN': // Chinese
        fontFace = 'zh';
        break;
      case 'kr': // Korean
        fontFace = 'kr';
        break;
      case 'ru': // Russian
        fontFace = 'ru';
        break;
      case 'ar': // Arabic
        fontFace = 'ar';
        break;
      case 'de':
      case 'en':
      case 'fr':
      case 'pt_BR': // Latin-based
      default:
        fontFace = 'lt';
        break;
    }

    return fontFace;
  }

  private isRTLLanguage(locale: string): boolean {
    let rtl = false;

    switch (locale) {
      case 'ar':
        rtl = true;
        break;
      default:
        break;
    }

    return rtl;
  }
}
</script>
