<template>
  <v-select
    v-model="language"
    :items="languages"
    :loading="loading"
    :label="$t('pages.settings.aniList.userAccountSettings.userTitleLanguage')"
    :hint="$t('pages.settings.aniList.userAccountSettings.userTitleLanguageHint')"
    persistent-hint
    menu-props="auto, offset-y"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListUserTitleLanguage } from '@/types';

@Component
export default class UserTitleLanguage extends Vue {
  @Prop(String) userTitleLanguage!: AniListUserTitleLanguage;
  loading: boolean = false;

  get languages(): Array<{ text: string; value: AniListUserTitleLanguage }> {
    const titleLanguages = Array.from(new Set(Object.values(AniListUserTitleLanguage)));

    return titleLanguages.map((item) => {
      return {
        text: this.$t(`misc.aniList.settings.titleLanguages.${item}`).toString(),
        value: item,
      };
    });
  }

  get language() {
    return this.userTitleLanguage;
  }

  set language(value: AniListUserTitleLanguage) {
    this.loading = true;
    this.$http
      .updateUserTitleLanguage(value)
      .then((titleLanguage) => {
        return this.$store.dispatch('userSettings/setUserTitleLanguage', titleLanguage);
      })
      .finally(() => (this.loading = false));
  }
}
</script>
