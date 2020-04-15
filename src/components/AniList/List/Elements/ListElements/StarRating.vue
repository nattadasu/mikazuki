<template>
  <v-rating :length="ratingStarAmount" half-increments dense small readonly :value="scoreStars" />
</template>

<script lang="ts">
// TODO: To be deleted!
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListScoreFormat, ZeroTwoListDataItem, IAniListSession } from '@/types';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('userSettings', ['session']),
  },
})
export default class StarRating extends Vue {
  @Prop(Object) item!: ZeroTwoListDataItem;
  @Prop(Number) ratingStarAmount!: number;
  readonly session!: IAniListSession;

  get score(): number {
    return this.item.entry.score;
  }

  get scoreStars(): number {
    if (!this.score) {
      return 0;
    }

    const userScoringSystem = this.session.user.mediaListOptions.scoreFormat;

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
