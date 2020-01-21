<template>
  <span v-if="nextEpisode" class="success--text">
    <v-icon color="success" small>mdi-calendar</v-icon>
    {{ nextEpisode }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ZeroTwoListDataItem } from '@/types';
import moment from 'moment';

@Component
export default class EpisodeState extends Vue {
  @Prop(Object) item!: ZeroTwoListDataItem;

  get nextEpisode(): string | null {
    return this.item.media.nextAiringEpisode
      ? this.$root
          .$t('pages.aniList.list.nextAiringEpisode', [
            this.item.media.nextAiringEpisode.episode,
            moment(this.item.media.nextAiringEpisode.airingAt, 'X').fromNow(),
          ])
          .toString()
      : null;
  }

  get status(): string {
    return this.item.media.status;
  }
}
</script>

<style scoped lang="scss">
span {
  vertical-align: middle !important;
}
</style>
