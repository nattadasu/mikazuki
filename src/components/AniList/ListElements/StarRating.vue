<template>
  <v-layout align-center justify-end>
    ({{ score }})<v-rating :length="ratingStarAmount" half-increments dense small readonly :value="scoreStars" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class StarRating extends Vue {
  @Prop(Number)
  score!: number;

  @Prop(Number)
  ratingStarAmount!: number;

  @Prop(Number)
  scoreStars!: number;
}
</script>
