<template>
  <v-content>
    <v-card tile raised>
      <v-card-text>
        <v-tabs v-model="tabs" grow>
          <v-tab v-for="tab in settingsTabs" :key="tab.key" :disabled="tab.disabled" ripple>
            {{ tab.value }}
          </v-tab>

          <v-tabs-items v-model="tabs">
            <AppSettings :tab-key="appSettingsTab.key" />

            <AniList :tab-key="aniListTab.key" />

            <About :tab-key="aboutTab.key" />

            <Changelog :tab-key="changelogTab.key" />

            <SpecialThanks :tab-key="specialThanksTab.key" />
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';
import AppSettings from './Settings/AppSettings.vue';
import AniList from './Settings/AniList.vue';
import About from './Settings/About.vue';
import Changelog from './Settings/Changelog.vue';
import SpecialThanks from './Settings/SpecialThanks.vue';

interface ISettingTab {
  key: string;
  value: TranslateResult;
  disabled?: boolean;
}

@Component({
  components: {
    About,
    AniList,
    AppSettings,
    Changelog,
    SpecialThanks,
  },
})
export default class Settings extends Vue {
  tabs = null;

  /**
   * @function settingsTabs
   * @returns {ISettingTab[]} the Settings tabs
   */
  get settingsTabs(): ISettingTab[] {
    return [this.appSettingsTab, this.aniListTab, this.aboutTab, this.changelogTab, this.specialThanksTab];
  }

  get appSettingsTab(): ISettingTab {
    return {
      key: 'appSettings',
      value: this.$t('menus.settings.appSettings'),
    };
  }

  get aniListTab(): ISettingTab {
    return {
      key: 'aniList',
      value: this.$t('menus.settings.aniList'),
    };
  }

  get aboutTab(): ISettingTab {
    return {
      key: 'about',
      value: this.$t('menus.settings.about'),
    };
  }

  get changelogTab(): ISettingTab {
    return {
      key: 'changelog',
      value: this.$t('menus.settings.changelog'),
    };
  }

  get specialThanksTab(): ISettingTab {
    return {
      key: 'specialThanks',
      value: this.$t('menus.settings.specialThanks'),
    };
  }
}
</script>
