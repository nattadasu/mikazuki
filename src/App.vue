<template>
  <v-app id="app">
    <Navigation />
    <router-view :key="$route.path" />
    <ZeroTwoNotifications position="top center" />
    <TopButton />
  </v-app>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { validLanguageCodes } from './i18n';
import eventHandler from '@/plugins/AniList/eventHandler';
import { refreshTimer } from '@/plugins/refreshTimer';
import Navigation from '@/components/Navigation.vue';
import TopButton from '@/components/TopButton.vue';
import ZeroTwoNotifications from '@/components/Notifications.vue';

@Component({
  components: {
    Navigation,
    TopButton,
    ZeroTwoNotifications,
  },
  computed: {
    ...mapGetters('app', ['language', 'darkMode']),
    ...mapGetters('userSettings', ['isAuthenticated', 'refreshRate']),
  },
})
export default class App extends Vue {
  readonly refreshTimer = refreshTimer;
  readonly language!: string;
  readonly darkMode!: boolean;
  readonly isAuthenticated!: boolean;
  readonly refreshRate!: number;

  @Watch('isAuthenticated')
  loggedInStateChanged(value: boolean) {
    if (value) {
      eventHandler.refreshAniListData().then(() => {
        this.refreshTimer.setRefreshRate(this.refreshRate).restartTimer();
      });
    } else {
      this.refreshTimer.resetTimer();
    }
  }

  @Watch('language')
  localeChanged(newLocale: string | undefined) {
    const root = document.getElementsByTagName('html')[0];

    this.$i18n.locale =
      newLocale && validLanguageCodes.includes(newLocale)
        ? (newLocale as string)
        : (this.$i18n.fallbackLocale as string);

    this.$vuetify.rtl = this.isRTLLanguage(this.$i18n.locale);
    moment.locale(this.$i18n.locale);
    root.setAttribute('class', `font-face-${this.getLocaleBasedFontFace(this.$i18n.locale)}`);
  }

  @Watch('darkMode')
  darkModeChanged(newValue: boolean) {
    this.$vuetify.theme.dark = newValue;
  }

  async created() {
    if (!this.language) {
      if (window.navigator.languages && window.navigator.languages.length) {
        this.$store.commit('app/setLanguage', window.navigator.languages[0]);
      } else {
        this.$store.commit('app/setLanguage', window.navigator.language);
      }
    } else {
      this.$i18n.locale = this.language;
    }

    const root = document.getElementsByTagName('html')[0];
    root.setAttribute('class', `font-face-${this.getLocaleBasedFontFace(this.$i18n.locale)}`);

    this.$vuetify.theme.dark = this.darkMode;
    this.$vuetify.rtl = this.isRTLLanguage(this.$i18n.locale);

    moment.locale(this.$i18n.locale);

    if (this.isAuthenticated) {
      this.refreshTimer.setRefreshRate(this.refreshRate).restartTimer();
      await eventHandler.refreshAniListData();
    }
  }

  async beforeDestroy() {
    this.refreshTimer.resetTimer();
  }

  getLocaleBasedFontFace(locale: string): string {
    let fontFace;

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
      case 'it':
      case 'pt_BR': // Latin-based
      default:
        fontFace = 'lt';
        break;
    }

    return fontFace;
  }

  isRTLLanguage(locale: string): boolean {
    let rtl = false;

    if (locale === 'ar') {
      rtl = true;
    }

    return rtl;
  }
}
</script>
