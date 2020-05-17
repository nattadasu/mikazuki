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
import _ from 'lodash';
import eventBus from '@/eventBus';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import { IAniListEntry, AniListListStatus } from '@/types';

interface UpdatePayload {
  id: number;
  title: string;
  status: AniListListStatus;
  progress: number;
  score: number;
  changeFrom: number;
}

@Component
export default class ProgressBar extends Vue {
  @Prop(Object) item!: IAniListEntry;
  @Prop(String) status!: AniListListStatus;
  readonly timeUntilUpdate = 1000;
  indeterminate: boolean = false;
  updateTimer: NodeJS.Timeout | null = null;
  updatePayload: UpdatePayload[] = [];

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

  increaseEpisodeCounter() {
    if (this.item.progress === this.item.media.episodes) {
      return;
    }

    // Set item data
    this.item.progress++;
    if (this.item.progress === this.item.media.episodes) {
      this.item.status = AniListListStatus.COMPLETED;
    }

    const payload: UpdatePayload = {
      id: this.item.id,
      title: this.item.media.title.userPreferred,
      progress: this.item.progress,
      status: this.item.status,
      score: this.item.score,
      changeFrom: Date.now(),
    };

    this.updatePayload.push(payload);

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(this.onUpdateTrigger, this.timeUntilUpdate);
  }

  onUpdateTrigger() {
    if (!this.updatePayload.length) {
      return;
    }

    const items = _.chain(this.updatePayload)
      .groupBy((item) => item.id)
      .map((group) =>
        _.reduce(group, (a: UpdatePayload, i: UpdatePayload) => (i.changeFrom > a.changeFrom ? i : a), {
          changeFrom: 0,
        } as UpdatePayload)
      )
      .filter((group) => !!group.id)
      .value();

    const updates = _.map(items, async (item) => {
      let completedAt;

      if (item.status === AniListListStatus.COMPLETED) {
        const now = new Date();
        completedAt = {
          year: now.getUTCFullYear(),
          month: now.getUTCMonth() + 1,
          day: now.getUTCDate(),
        };
      }

      return this.$http.updateEntry({
        entryId: item.id,
        progress: item.progress,
        status: item.status,
        score: item.score,
        completedAt,
      });
    });

    Promise.all(updates)
      .then(() => aniListEventHandler.refreshLists())
      .then(() => {
        _.forEach(items, (item) => {
          const updateText = item.status === AniListListStatus.COMPLETED ? 'completeUpdateText' : 'simpleUpdateText';
          this.$notify({
            title: this.$t('notifications.aniList.successTitle').toString(),
            text: this.$t(`notifications.aniList.${updateText}`, [item.title, item.progress]).toString(),
          });
        });
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.updatePayload = [];
      });
  }
}
</script>
