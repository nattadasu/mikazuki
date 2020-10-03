<template>
  <v-select
    v-model="format"
    :items="formats"
    :loading="loading"
    :label="$t('pages.settings.aniList.userAccountSettings.scoringFormat')"
    :hint="$t('pages.settings.aniList.userAccountSettings.scoringFormatHint')"
    persistent-hint
    menu-props="auto, offset-y"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListScoreFormat } from '@/types';

@Component
export default class ScoringFormat extends Vue {
  @Prop(String) scoringFormat!: AniListScoreFormat;
  loading: boolean = false;

  get formats(): Array<{ text: string; value: AniListScoreFormat }> {
    const items = Array.from(new Set(Object.values(AniListScoreFormat)));

    return items.map((item) => {
      return {
        text: this.$t(`misc.aniList.settings.scoringFormats.${item}`).toString(),
        value: item,
      };
    });
  }

  get format() {
    return this.scoringFormat;
  }

  set format(value: AniListScoreFormat) {
    this.loading = true;
    this.$http
      .updateScoringFormat(value)
      .then((format) => {
        return this.$store.dispatch('userSettings/setScoringFormat', format);
      })
      .finally(() => (this.loading = false));
  }
}
</script>
