<template>
  <v-progress-linear color="success darken-3" :value="percentage" :indeterminate="indeterminate" :height="25">
    <v-row align="center">
      <v-col cols="auto">
        <span class="pl-3 white--text">{{ currentProgress }} / {{ episodeAmount }}</span>
      </v-col>

      <v-spacer />

      <v-col cols="auto">
        <v-btn v-if="!completedList" small text icon @click="increaseEpisodeCounter">
          <v-icon size="18">
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-progress-linear>
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
