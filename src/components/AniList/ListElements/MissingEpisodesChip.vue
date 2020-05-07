<template>
  <v-hover v-slot:default="{ hover }" v-if="missingEpisodes">
    <v-chip small :ripple="false" link color="info darken-2">
      <v-expand-x-transition>
        <span v-if="hover || isMobile">{{
          $tc('pages.aniList.list.missingEpisodes', missingEpisodes, [missingEpisodes])
        }}</span>
      </v-expand-x-transition>

      <v-icon small :right="hover || isMobile">mdi-fast-forward</v-icon>
    </v-chip>
  </v-hover>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import RegularFunctionsMixin from '@/mixins/regular';
import { IAniListNextAiringEpisode } from '@/types';

export default class MissingEpisodesChip extends Mixins(RegularFunctionsMixin) {
  @Prop(Number) progress!: number;
  @Prop(Object) nextAiringEpisode!: IAniListNextAiringEpisode;

  get missingEpisodes(): number {
    const { progress, nextAiringEpisode } = this;
    if (!nextAiringEpisode) {
      return 0;
    }
    const nextEpisode = nextAiringEpisode.episode;
    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - progress > 0 ? nextEpisode - 1 - progress : 0;
  }
}
</script>
