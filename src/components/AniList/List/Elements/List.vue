<template>
  <v-container fluid class="py-0 px-1" :class="{ 'fill-height': isLoading || (!isLoading && emptyList) }">
    <v-row no-gutters>
      <v-col v-show="isLoading" cols="12" align-self="center">
        <div class="display-3 text-center">
          <Loading size="32" />
          {{ $t('actions.loading') }}
        </div>
      </v-col>
      <v-col v-if="!listData.length && !isLoading" cols="12">
        <v-container>
          <div class="display-3 text-center">
            {{ $t('$vuetify.noDataText') }}
          </div>
        </v-container>
      </v-col>
      <template v-if="!isLoading">
        <v-col
          v-for="item in slicedListData"
          :key="item.entry.id"
          class="lg5-custom"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <v-lazy :value="false" :options="{ threshold: 0.5 }" transition="fade-transition">
            <v-card flat outlined class="ma-2" :id="item.entry.id">
              <ListImage :item="item" :show-studios="false" />

              <ProgressBar :item="item" :status="status" :increase-episode="increaseEpisode" />
            </v-card>
          </v-lazy>
        </v-col>
      </template>
      <v-snackbar v-model="isSnackbarVisible" top :color="snackbarColor" :timeout="3500">
        {{ snackbarText }}
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { chain, isEmpty, reduce, orderBy, get, includes } from 'lodash';
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import EventBus from '@/eventBus';
import {
  AniListListStatus,
  AniListScoreFormat,
  IAniListEntry,
  IAniListSession,
  IAniListMediaListCollection,
  ZeroTwoUpdateBucketItem,
  ZeroTwoListDataItem,
} from '@/types';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import {
  AdultTooltip,
  EpisodeState,
  ListImage,
  MissingEpisodes,
  ProgressBar,
  ProgressCircle,
  StarRating,
} from './ListElements';
import Loading from '@/components/BaseElements/Navigation/NavigationToolbars/Items/Loading.vue';
import { Route } from 'vue-router';

@Component({
  components: {
    AdultTooltip,
    EpisodeState,
    ListImage,
    MissingEpisodes,
    ProgressCircle,
    StarRating,
    Loading,
    ProgressBar,
  },
  computed: {
    ...mapGetters('app', ['isLoading']),
    ...mapGetters('aniList', ['aniListData']),
    ...mapGetters('userSettings', ['session']),
  },
})
export default class List extends Vue {
  @Prop(String) readonly status!: AniListListStatus;
  @Prop(Object) readonly lastRoute!: Route | null;
  currentIndex: number = 0;
  // TODO: Add startAmount to settings
  readonly startAmount = 20;
  // Contains the Timer ID
  updateTimer: number | null = null;
  updatePayload: ZeroTwoUpdateBucketItem[] = [];
  updateInterval = 750;
  snackbarColor: string = 'success';
  isSnackbarVisible: boolean = false;
  snackbarText: string = '';
  sortDirection: string = 'asc';
  sortBy: string = 'title.userPreferred';
  genreFilters: string[] = [];
  mediaShowMode: string = 'non-explicit';

  readonly session!: IAniListSession;
  readonly isLoading!: boolean;
  readonly aniListData!: IAniListMediaListCollection;

  get ratingStarAmount(): number {
    return this.session.user.mediaListOptions.scoreFormat === AniListScoreFormat.POINT_3 ? 3 : 5;
  }

  get listData(): ZeroTwoListDataItem[] {
    if (!this.currentList) {
      return [];
    }

    const mappedEntries = this.currentList.entries
      .map(
        (entry: IAniListEntry): ZeroTwoListDataItem => {
          const { media } = entry;
          const { year, month, day } = media.startDate;
          const image = media.coverImage.extraLarge;

          return {
            entry,
            media,
            image,
            startDate: new Date(year, month, day),
          };
        }
      )
      .filter((entry: ZeroTwoListDataItem) => {
        const { isAdult } = entry.media;
        if (isAdult) {
          if (this.mediaShowMode === 'non-explicit') {
            return false;
          }
        } else {
          if (this.mediaShowMode === 'explicit') {
            return false;
          }
        }

        if (this.genreFilters.length) {
          return this.genreFilters.every((genre) => entry.media.genres.includes(genre));
        }

        return true;
      });

    const sortDirection = this.sortDirection === 'asc' ? 'asc' : 'desc';

    return orderBy(mappedEntries, (entry: ZeroTwoListDataItem) => get(entry.media, this.sortBy), [sortDirection]);
  }

  get slicedListData(): ZeroTwoListDataItem[] {
    return this.listData.slice(0, (this.currentIndex + 1) * this.startAmount);
  }

  get emptyList(): boolean {
    return this.listData.length === 0;
  }

  get currentList() {
    return this.aniListData.lists.find((list) => list.status === this.status);
  }

  async created() {
    // Infinite Scrolling
    window.onscroll = async () => {
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;
      if (bottomOfWindow) {
        this.currentIndex += this.startAmount;
      }
    };

    EventBus.$on('changeSorting', (item: { sortBy: string; direction: string }) => {
      this.sortBy = item.sortBy;
      this.sortDirection = item.direction;
    });

    EventBus.$on('changeFiltering', (item: { genres: string[] }) => {
      this.genreFilters = item.genres;
    });

    await this.$store.dispatch('setLoadingState', false);
  }

  getScoreStarValue(score: number): number {
    if (!score) {
      return 0;
    }

    const userScoringSystem = this.session.user.mediaListOptions.scoreFormat;

    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 20;
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 2;
      case AniListScoreFormat.POINT_5:
      case AniListScoreFormat.POINT_3:
        return score;
      default:
        return 0;
    }
  }

  calculateProgressPercentage(entry: IAniListEntry): number {
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

  calculateMissingEpisodes(entry: IAniListEntry): number | null {
    const { nextAiringEpisode } = entry.media;
    const currentProgress = entry.progress;

    // We don't care about episodes that are not airing anymore.
    if (!nextAiringEpisode) {
      return null;
    }

    const nextEpisode = nextAiringEpisode.episode;

    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - currentProgress > 0 ? nextEpisode - 1 - currentProgress : null;
  }

  increaseEpisode(entryId: number): void {
    const listEntry = this.listData.find((item) => item.entry.id === entryId);

    if (!listEntry) {
      return;
    }

    const { progress } = listEntry.entry;
    const { episodes } = listEntry.media;
    if (progress + 1 >= episodes) {
      listEntry.entry.status = AniListListStatus.COMPLETED;
      listEntry.entry.progress++;
    } else {
      listEntry.entry.progress++;
    }

    this.startUpdateTimer(listEntry);
  }

  startUpdateTimer(listEntry: ZeroTwoListDataItem) {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const { entry } = listEntry;
    const now = Date.now();
    const uploadEntry = {
      id: entry.id,
      mediaId: entry.media.id,
      title: entry.media.title.userPreferred,
      progress: entry.progress,
      status: entry.status,
      score: entry.score,
      changeFrom: now,
    };

    this.updatePayload.push(uploadEntry);
    this.updateTimer = setTimeout(this.updateChanges, this.updateInterval) as any;
  }

  async updateChanges() {
    if (isEmpty(this.updatePayload)) {
      return;
    }

    const entries = chain(this.updatePayload)
      .groupBy((value) => value.id)
      .map((group) =>
        reduce(
          group,
          (accumulator: ZeroTwoUpdateBucketItem, item: ZeroTwoUpdateBucketItem) =>
            item.changeFrom > accumulator.changeFrom ? item : accumulator,
          {
            id: null,
            mediaId: null,
            title: null,
            status: null,
            progress: null,
            score: null,
            changeFrom: 0,
          }
        )
      )
      .filter((group) => !!group.id)
      .map(async (entry) => {
        const { id, status, progress, score } = entry;

        if (!id || progress === null) {
          return;
        }

        let completedAt = undefined;
        if (status === AniListListStatus.COMPLETED) {
          const now = new Date();
          completedAt = {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate(),
          };
        }

        return this.$http.updateEntry({
          entryId: id,
          progress,
          status: status ? status : undefined,
          score: score ? score : undefined,
          completedAt,
        });
      })
      .value();

    if (isEmpty(entries)) {
      return;
    }

    Promise.all(entries)
      .then(() => aniListEventHandler.refreshLists())
      .then(() => {
        let updateText = '';
        chain(this.updatePayload)
          .groupBy((value) => value.id)
          .map((group) =>
            reduce(
              group,
              (accumulator: ZeroTwoUpdateBucketItem, item: ZeroTwoUpdateBucketItem) =>
                item.changeFrom > accumulator.changeFrom ? item : accumulator,
              {
                id: null,
                mediaId: null,
                title: null,
                status: null,
                progress: null,
                score: null,
                changeFrom: 0,
              }
            )
          )
          .filter((group) => !!group.id)
          .value()
          .forEach((item) => {
            updateText = item.status === AniListListStatus.COMPLETED ? 'completeUpdateText' : 'simpleUpdateText';
            this.$notify({
              title: this.$t('notifications.aniList.successTitle') as string,
              text: this.$t(`notifications.aniList.${updateText}`, [item.title, item.progress]) as string,
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

<style lang="scss" scoped>
@media (min-width: 1480px) and (max-width: 1920px) {
  .lg5-custom[class*='col-'] {
    width: 20% !important;
    max-width: 20% !important;
    flex-basis: 20% !important;
  }
}
</style>
