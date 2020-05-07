<template>
  <v-container fluid class="py-0">
    <h1 class="headline">{{ $t('menus.settings.appSettings') }}</h1>
    <v-row>
      <v-col cols="5">
        <v-switch v-model="_darkMode" :label="$t('pages.settings.appSettings.darkMode')" />

        <h3>{{ $t('pages.settings.appSettings.navigationActiveItemColour') }}</h3>
        <v-chip-group v-model="_navigationDrawerListItemColor" column mandatory active-class="primary--text">
          <v-chip small value="auto">
            <v-icon left small :color="darkMode ? 'white' : 'black'" v-text="'mdi-circle'" />
            {{ $t('misc.colours.automatic') }}
          </v-chip>
          <v-chip small value="black">
            <v-icon left small color="black" v-text="'mdi-circle'" />
            {{ $t('misc.colours.black') }}
          </v-chip>
          <v-chip small value="white">
            <v-icon left small color="white" v-text="'mdi-circle'" />
            {{ $t('misc.colours.white') }}
          </v-chip>
        </v-chip-group>

        <h3>{{ $t('pages.settings.appSettings.navigationBackgroundBrightness') }}</h3>
        <v-slider thumb-label inverse-label :label="`${_brightness}%`" v-model="_brightness" :min="0" :max="100" />

        <h3>{{ $t('pages.settings.appSettings.navigationBackgroundBlurriness') }}</h3>
        <v-slider thumb-label inverse-label :label="`${_blurriness}px`" v-model="_blurriness" :min="0" :max="20" />
      </v-col>

      <v-col cols="7">
        <h3>{{ $t('pages.settings.appSettings.chooseLanguage') }}</h3>
        <v-chip-group v-model="_language" column mandatory active-class="primary--text">
          <v-chip filter filter-icon="mdi-earth" small v-for="item in languages" :key="item.value" :value="item.value">
            {{ item.original }} ({{ item.english }})
          </v-chip>
        </v-chip-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('app', [
      'darkMode',
      'language',
      'navigationDrawerListItemColor',
      'navigationDrawerBackgroundBrightness',
      'navigationDrawerBackgroundBlurriness',
    ]),
  },
})
export default class AppSettings extends Vue {
  readonly darkMode!: boolean;
  readonly language!: string;
  readonly navigationDrawerListItemColor!: string;
  readonly navigationDrawerBackgroundBrightness!: number;
  readonly navigationDrawerBackgroundBlurriness!: number;

  get _darkMode(): boolean {
    return this.darkMode;
  }
  set _darkMode(value: boolean) {
    this.$store.commit('app/setDarkMode', value);
  }

  get _navigationDrawerListItemColor(): string {
    return this.navigationDrawerListItemColor;
  }
  set _navigationDrawerListItemColor(value: string) {
    this.$store.commit('app/setNavigationDrawerListItemColor', value);
  }

  _updateTimer: NodeJS.Timeout | null = null;
  get _brightness(): number {
    return this.navigationDrawerBackgroundBrightness;
  }
  set _brightness(value: number) {
    if (this.$data._updateTimer) {
      clearTimeout(this.$data._updateTimer);
    }

    this.$data._updateTimer = setTimeout(() => {
      this.$store.commit('app/setNavigationDrawerBackgroundBrightness', value);
    }, 250);
  }

  _blurUpdateTimer: NodeJS.Timeout | null = null;
  get _blurriness(): number {
    return this.navigationDrawerBackgroundBlurriness;
  }
  set _blurriness(value: number) {
    if (this.$data._blurUpdateTimer) {
      clearTimeout(this.$data._blurUpdateTimer);
    }

    this.$data._blurUpdateTimer = setTimeout(() => {
      this.$store.commit('app/setNavigationDrawerBackgroundBlurriness', value);
    }, 250);
  }

  get _language(): string {
    return this.language;
  }
  set _language(value: string) {
    this.$store.commit('app/setLanguage', value);
  }

  get languages(): Array<{ value: string; original: string; english: string }> {
    const { messages } = this.$i18n;

    return Object.entries(messages).map(([key, value]) => {
      const locale = key;
      const original = value.originalReading.toString();
      const english = value.englishReading.toString();

      return {
        value: locale,
        original,
        english,
      };
    });
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  grid-auto-rows: minmax(120px, auto);
}
</style>
