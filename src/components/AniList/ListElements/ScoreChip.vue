<template>
  <v-hover v-slot:default="{ hover }">
    <v-chip small :ripple="false" link :color="scoreColor">
      <v-icon small :left="hover || isMobile">mdi-star</v-icon>

      <v-expand-x-transition>
        <span v-if="hover || isMobile">{{ score }}</span>
      </v-expand-x-transition>
    </v-chip>
  </v-hover>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import RegularFunctionsMixin from '@/mixins/regular';
import { AniListScoreFormat } from '@/types';

@Component
export default class ScoreChip extends Mixins(RegularFunctionsMixin) {
  @Prop(Number) score!: number;
  @Prop(String) scoreFormat!: string;

  get scoreColor(): string {
    const score = this.score;
    if (!score) {
      return 'error darken-2';
    }
    const userScoringSystem = this.scoreFormat;
    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 100 < 1 / 3 ? 'error darken-2' : score / 100 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 10 < 1 / 3 ? 'error darken-2' : score / 10 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_5:
        return score / 5 < 1 / 3 ? 'error darken-2' : score / 5 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_3:
        return score <= 1 ? 'error darken-2' : score === 2 ? 'warning darken-2' : 'success darken-2';
      default:
        return 'white';
    }
  }
}
</script>
