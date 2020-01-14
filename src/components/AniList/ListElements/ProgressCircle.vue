<template>
  <v-progress-circular
    class="episodeProgress"
    color="success"
    :value="percentage"
    :indeterminate="indeterminate"
    size="75"
    rotate="-90"
  >
    <div class="episodeCount">
      {{ currentProgress }}
    </div>
    <div class="episodeDivider" />
    <div class="episodeAmount" :class="{ complete: completedList }">
      {{ episodeAmount }}
    </div>
    <v-btn
      v-if="!completedList"
      class="episodeIncrease"
      small
      text
      icon
      color="success"
      @click="increaseEpisodeCounter"
    >
      <v-icon size="18">
        mdi-plus
      </v-icon>
    </v-btn>
  </v-progress-circular>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { AniListListStatus, ZeroTwoListDataItem } from '@/types';

@Component
export default class ProgressCircle extends Vue {
  @Prop(Object) item!: ZeroTwoListDataItem;
  @Prop(String) status!: string;
  @Prop(Function) increaseEpisode!: Function;
  indeterminate: boolean = false;

  get completedList(): boolean {
    return this.status === AniListListStatus.COMPLETED;
  }

  get entryId(): number {
    return this.item.entry.id;
  }

  get percentage(): number {
    const { entry } = this.item;
    const { episodes } = entry.media;
    const { nextAiringEpisode } = entry.media;
    const currentProgress = entry.progress;

    if (!currentProgress) {
      return 0;
    }

    // Check if max episode amount is known
    if (episodes) {
      return (currentProgress / episodes) * 100;
    }

    // We don't know the exact amount of episodes
    // But we might know how many episodes have been aired so far
    // so we can calculate the percentage of the currently available episodes
    // and then add some buffer
    if (nextAiringEpisode && nextAiringEpisode.episode) {
      // We have to substract one here as that episode isn't aired yet
      const episode = nextAiringEpisode.episode - 1 > 0 ? nextAiringEpisode.episode - 1 : 1;

      // We choose only 80 percent here, as we are unaware of the episode amount
      return (currentProgress / episode) * 80;
    }

    // Just return 75% if we have a non-zero progress but
    // neither through the next airing episode nor through the episode amount
    // we can determine our status.
    return 75;
  }

  get currentProgress(): number {
    return this.item.entry.progress;
  }

  get episodeAmount(): number | string {
    return this.item.media.episodes || '?';
  }

  async increaseEpisodeCounter() {
    this.indeterminate = true;

    try {
      await this.increaseEpisode(this.entryId);
      this.indeterminate = false;
    } catch (error) {
      console.error('nope');
    }
  }
}
</script>

<style lang="scss" scoped>
.episodeProgress {
  &:hover {
    & .episodeAmount:not(.complete) {
      opacity: 0;
    }

    & .episodeIncrease {
      opacity: 1;
    }
  }

  .episodeCount {
    font-size: 15pt;
    position: absolute;
    top: 15px;
    left: 12px;
    z-index: 1;
    width: 50px;
    text-align: center;
    font-family: 'Nunito', 'Helvetica Neue', 'Helvetica', Arial, sans-serif !important;
  }

  .episodeDivider {
    font-size: 15pt;
    position: absolute;
    top: 23px;
    left: 33px;
    transform: scaleX(5);
    text-align: center;
    z-index: 2;
    font-family: 'Nunito', 'Helvetica Neue', 'Helvetica', Arial, sans-serif !important;

    &::before {
      content: '_';
    }
  }

  .episodeAmount {
    position: absolute;
    top: 44px;
    left: 12px;
    z-index: 3;
    text-align: center;
    width: 50px;
    transition: opacity ease-in-out 0.2s;
    font-family: 'Nunito', 'Helvetica Neue', 'Helvetica', Arial, sans-serif !important;
  }

  .episodeIncrease {
    position: absolute;
    top: 44px;
    left: 24px;
    width: 25px;
    height: 25px;
    z-index: 4;
    margin: 0;
    opacity: 0;
    transition: opacity ease-in-out 0.2s;
  }
}
</style>
