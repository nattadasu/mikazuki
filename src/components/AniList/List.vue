<template>
  <v-container fluid class="py-0 px-1">
    <v-row no-gutters>
      <v-col v-show="isLoading" cols="12" align-self="center">
        <div class="display-3 text-center ma-6">
          {{ $t('actions.loading') }}
        </div>
      </v-col>
      <v-col v-if="!listData.length && !isLoading" cols="12">
        <v-container>
          <div class="headline text-center">
            {{ $t('$vuetify.noDataText') }}
          </div>
        </v-container>
      </v-col>
      <template v-if="!isLoading">
        <v-col v-for="item in listData" :key="item.id" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-card raised class="ma-2">
            <ListImage :image-link="item.imageLink" :ani-list-id="item.aniListId" :name="item.title" />

            <v-card-text class="py-0">
              <v-row>
                <v-col cols="4">
                  <ProgressCircle
                    :entry-id="item.id"
                    :status="status"
                    :progress-percentage="item.progressPercentage"
                    :current-progress="item.currentProgress"
                    :episode-amount="item.episodeAmount"
                    @increase="increaseCurrentEpisodeProgress"
                  />
                </v-col>

                <v-col cols="8">
                  <v-row align="center" justify="end">
                    <v-col cols="12" class="py-0">
                      <EpisodeState :status="item.mediaStatus" :next-episode="item.nextEpisode" />
                    </v-col>
                    <v-col cols="12" class="py-0">
                      <MissingEpisodes
                        :next-airing-episode="item.nextAiringEpisode"
                        :current-progress="item.currentProgress"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <AdultToolTip v-if="item.forAdults" />
              <StarRating :score="item.score" :rating-star-amount="ratingStarAmount" :score-stars="item.scoreStars" />
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
      <v-snackbar v-model="isSnackbarVisible" top :color="snackbarColor" :timeout="3500">
        {{ snackbarText }}
      </v-snackbar>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { chain, isEmpty, reduce, get, includes } from 'lodash';
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
} from '@/types';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import AdultToolTip from './ListElements/AdultToolTip.vue';
import EpisodeState from './ListElements/EpisodeState.vue';
import ListImage from './ListElements/ListImage.vue';
import MissingEpisodes from './ListElements/MissingEpisodes.vue';
import ProgressCircle from './ListElements/ProgressCircle.vue';
import StarRating from './ListElements/StarRating.vue';

interface UpdatePayloadProperties {
  id: number | null;
  title: string | null;
  status: AniListListStatus | null;
  progress: number | null;
  score: number | null;
  changeFrom: number;
}

@Component({
  components: {
    AdultToolTip,
    EpisodeState,
    ListImage,
    MissingEpisodes,
    ProgressCircle,
    StarRating,
  },
  computed: {
    ...mapGetters('app', ['isLoading']),
    ...mapGetters('aniList', ['aniListData']),
    ...mapGetters('userSettings', ['session']),
  },
})
export default class List extends Vue {
  // TODO: Make this a non-static number via Store
  startAmount: number = 20;

  currentIndex: number = 0;

  // Contains the Timer ID
  updateTimer: number | null = null;

  updatePayload: any[] = [];

  updateInterval = 750;

  snackbarColor: string = 'success';

  isSnackbarVisible: boolean = false;

  snackbarText: string = '';

  sortDirection: string = 'asc';

  sortBy: string = 'title';

  genreFilters: string[] = [];

  readonly session!: IAniListSession;
  readonly isLoading!: boolean;
  readonly aniListData!: IAniListMediaListCollection;

  @Prop()
  readonly status!: AniListListStatus;

  get ratingStarAmount(): number {
    return this.session.user.mediaListOptions.scoreFormat === AniListScoreFormat.POINT_3 ? 3 : 5;
  }

  get listData() {
    if (!this.aniListData.lists.length) {
      return [];
    }

    const listElement = this.aniListData.lists.find((list) => list.status === this.status);

    if (!listElement) {
      return [];
    }

    let newEntries = listElement.entries.map((entry) => {
      const { media } = entry;
      const scoreStars = this.getScoreStarValue(entry.score);
      const imageLink = media.coverImage.extraLarge;

      const nextEpisode = media.nextAiringEpisode
        ? this.$root.$t('pages.aniList.list.nextAiringEpisode', [
            media.nextAiringEpisode.episode,
            moment(media.nextAiringEpisode.airingAt, 'X').fromNow(),
          ])
        : null;
      const progressPercentage = this.calculateProgressPercentage(entry);
      const missingEpisodes = this.calculateMissingEpisodes(entry);

      const { year, month, day } = entry.media.startDate;

      return {
        aniListId: media.id,
        currentProgress: entry.progress,
        entry,
        episodeAmount: media.episodes || '?',
        forAdults: media.isAdult,
        genres: media.genres,
        id: entry.id,
        imageLink,
        mediaStatus: media.status,
        missingEpisodes,
        nextAiringEpisode: media.nextAiringEpisode,
        nextEpisode,
        progressPercentage,
        score: entry.score,
        scoreStars,
        startDate: new Date(year, month, day),
        status: entry.status,
        studios: media.studios,
        title: media.title.userPreferred,
      };
    });

    const sortDirection = this.sortDirection === 'asc' ? 'asc' : 'desc';

    // @TODO: Give entry a type!
    const filterGenres = (entry: any): boolean => {
      if (!this.genreFilters.length) {
        return true;
      }

      return this.genreFilters.every((genre) => includes(entry.genres, genre));
    };

    newEntries = chain(newEntries)
      .filter(filterGenres)
      .orderBy((entry) => get(entry, this.sortBy), [sortDirection])
      .slice(0, this.startAmount + this.currentIndex)
      .value();

    return newEntries;
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

  increaseCurrentEpisodeProgress(entryId: number): void {
    const listEntry = this.listData.find((entry) => entry.id === entryId);

    if (!listEntry) {
      return;
    }

    const { currentProgress, episodeAmount } = listEntry;
    if (currentProgress + 1 >= episodeAmount) {
      listEntry.status = AniListListStatus.COMPLETED;
      listEntry.currentProgress++;
    } else {
      listEntry.currentProgress++;
    }

    this.startUpdateTimer(listEntry);
  }

  startUpdateTimer(listEntry: any) {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const now = Date.now();
    const entry = {
      id: listEntry.id,
      mediaId: listEntry.aniListId,
      title: listEntry.title,
      progress: listEntry.currentProgress,
      status: listEntry.status,
      score: listEntry.score,
      changeFrom: now,
    };

    this.updatePayload.push(entry);
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
          (accumulator: UpdatePayloadProperties, item: UpdatePayloadProperties) =>
            item.changeFrom > accumulator.changeFrom ? item : accumulator,
          {
            id: null,
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

    entries.push(aniListEventHandler.refreshLists());

    Promise.all(entries)
      .then(() => {
        let updateText = '';
        chain(this.updatePayload)
          .groupBy((value) => value.id)
          .map((group) =>
            reduce(
              group,
              (accumulator: UpdatePayloadProperties, item: UpdatePayloadProperties) =>
                item.changeFrom > accumulator.changeFrom ? item : accumulator,
              {
                id: null,
                title: null,
                status: null,
                progress: null,
                score: null,
                changeFrom: 0,
              }
            )
          )
          .filter((group) => !!group.id)
          .forEach((item) => {
            updateText = item.status === AniListListStatus.COMPLETED ? 'completeUpdateText' : 'simpleUpdateText';
            this.$notify({
              title: this.$t('notifications.aniList.successTitle') as string,
              text: this.$t(`notifications.aniList.${updateText}`, [item.title, item.progress]) as string,
            });
          });
      })
      .catch((error) => console.error(error)) // eslint-disable-line no-console
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
