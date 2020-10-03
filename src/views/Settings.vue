<template>
  <v-main>
    <v-card tile raised>
      <v-card-text>
        <v-tabs v-model="tabs" grow>
          <v-tab v-for="tab in settingsTabs" :key="tab.key" :disabled="tab.disabled" ripple>
            {{ tab.value }}
          </v-tab>

          <v-tabs-items v-model="tabs">
            <AniList :tab-key="aniListTab.key" />
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';
import AniList from './Settings/AniList.vue';

interface ISettingTab {
  key: string;
  value: TranslateResult;
  disabled?: boolean;
}

@Component({
  components: {
    AniList,
  },
})
export default class Settings extends Vue {
  tabs = null;

  /**
   * @function settingsTabs
   * @returns {ISettingTab[]} the Settings tabs
   */
  get settingsTabs(): ISettingTab[] {
    return [this.aniListTab];
  }

  get aniListTab(): ISettingTab {
    return {
      key: 'aniList',
      value: this.$t('menus.settings.aniList'),
    };
  }
}
</script>
