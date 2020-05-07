<template>
  <v-hover v-slot:default="{ hover }" v-if="nextEpisode">
    <v-chip small :ripple="false" link color="indigo">
      <v-icon small :left="hover || isMobile">mdi-calendar</v-icon>

      <v-expand-x-transition>
        <span v-if="hover || isMobile">{{ nextEpisode }}</span>
      </v-expand-x-transition>
    </v-chip>
  </v-hover>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Mixins, Prop } from 'vue-property-decorator';
import RegularFunctionsMixin from '@/mixins/regular';
import { IAniListNextAiringEpisode } from '../../../types';

@Component
export default class NextEpisodeChip extends Mixins(RegularFunctionsMixin) {
  @Prop(Object) nextAiringEpisode!: IAniListNextAiringEpisode;

  get nextEpisode(): string | null {
    return this.nextAiringEpisode
      ? this.$t('pages.aniList.list.nextAiringEpisode', [
          this.nextAiringEpisode.episode,
          moment(this.nextAiringEpisode.airingAt, 'X').fromNow(),
        ]).toString()
      : null;
  }
}
</script>
