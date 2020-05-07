<template>
  <v-progress-linear color="success darken-3" :value="percentage" :indeterminate="indeterminate" :height="25">
    <v-container class="ma-0 pa-0 d-flex flex-row align-center align-self-baseline justify-space-between">
      <span class="pl-3 white--text episodeCount">{{ currentProgress }} / {{ episodeAmount }}</span>
      <v-btn v-if="!isCompletedList" small text icon @click="increaseEpisodeCounter">
        <v-icon size="18">
          mdi-plus
        </v-icon>
      </v-btn>
    </v-container>
  </v-progress-linear>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAniListEntry, AniListListStatus } from '../../../types';

@Component
export default class ProgressBar extends Vue {
  @Prop(Object) item!: IAniListEntry;
  @Prop(String) status!: AniListListStatus;
  indeterminate: boolean = false;

  get isCompletedList(): boolean {
    return this.status === AniListListStatus.COMPLETED;
  }

  get entryId(): number {
    return this.item.id;
  }

  get percentage(): number {
    const { media, progress } = this.item;
    const { episodes, nextAiringEpisode } = media;

    if (!progress) {
      return 0;
    }
    // Check if max episode amount is known
    if (episodes) {
      return (progress / episodes) * 100;
    }
    // We don't know the exact amount of episodes
    // But we might know how many episodes have been aired so far
    // so we can calculate the percentage of the currently available episodes
    // and then add some buffer
    if (nextAiringEpisode && nextAiringEpisode.episode) {
      // We have to substract one here as that episode isn't aired yet
      const episode = nextAiringEpisode.episode - 1 > 0 ? nextAiringEpisode.episode - 1 : 1;
      // We choose only 80 percent here, as we are unaware of the episode amount
      return (progress / episode) * 80;
    }
    // Just return 75% if we have a non-zero progress but
    // neither through the next airing episode nor through the episode amount
    // we can determine our status.
    return 75;
  }

  get currentProgress(): number {
    return this.item.progress;
  }

  get episodeAmount(): number | string {
    return this.item.media.episodes || '?';
  }

  async increaseEpisodeCounter() {
    this.indeterminate = true;
    try {
      // await this.increaseEpisode(this.entryId);
      this.indeterminate = false;
    } catch (error) {
      console.error('nope');
    }
  }
}
</script>
