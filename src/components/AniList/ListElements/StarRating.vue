<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-rating :length="ratingStarAmount" half-increments dense small readonly :value="scoreStars" v-on="on" />
    </template>
    <span>{{ score }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListScoreFormat, ZeroTwoListDataItem } from '@/types';
import { userStore } from '@/store';

@Component
export default class StarRating extends Vue {
  @Prop(Object) item!: ZeroTwoListDataItem;
  @Prop(Number) ratingStarAmount!: number;

  get score(): number {
    return this.item.entry.score;
  }

  get scoreStars(): number {
    if (!this.score) {
      return 0;
    }

    const userScoringSystem = userStore.session.user.mediaListOptions.scoreFormat;

    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return this.score / 20;
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return this.score / 2;
      case AniListScoreFormat.POINT_5:
      case AniListScoreFormat.POINT_3:
        return this.score;
      default:
        return 0;
    }
  }
}
</script>
