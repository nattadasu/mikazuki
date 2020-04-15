<template>
  <v-content>
    <v-container fluid class="py-0 px-1">
      <v-row no-gutters>
        <v-col v-for="item in slicedMedia" :key="item.id" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-card raised class="ma-2">
            <ListImage :item="item" :show-studios="true" />

            <add-button :item="item" @set-status="setStatus" />
          </v-card>
        </v-col>
        <v-col v-if="!media.length" cols="12" class="text-center display-2 ma-4">
          {{ $t('$vuetify.noDataText') }}
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { chain, includes, get } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { Route } from 'vue-router';
import ListImage from './Elements/ListImage.vue';
import AddButton from './Elements/AddButton.vue';
import eventBus from '@/eventBus';
import {
  AniListSeason,
  IAniListEntry,
  IAniListMediaListCollection,
  IAniListSeasonPreviewMedia,
  AniListListStatus,
} from '@/types';

interface UpdateSeasonProperties {
  year: number;
  season: AniListSeason;
}

Component.registerHooks(['beforeRouteUpdate', 'beforeRouteLeave']);

@Component({
  components: {
    ListImage,
    AddButton,
  },
  computed: {
    ...mapGetters('app', ['isLoading']),
    ...mapGetters('userSettings', ['isAuthenticated', 'allowAdultContent']),
    ...mapGetters('aniList', ['aniListData']),
  },
})
export default class SeasonPreview extends Vue {
  readonly isLoading!: boolean;
  readonly isAuthenticated!: boolean;
  readonly allowAdultContent!: boolean;
  readonly aniListData!: IAniListMediaListCollection;

  // TODO: Add to Settings
  readonly startAmount = 20;
  media: IAniListSeasonPreviewMedia[] = [];
  seasonYear: number = new Date().getUTCFullYear();
  season: AniListSeason = this.getCurrentSeason();
  sortDirection: string = 'asc';
  sortBy: string = 'title';
  genreFilters: string[] = [];
  adultContentFilter: string = 'without';
  currentIndex: number = 0;

  get preparedMedia() {
    const sortDirection = this.sortDirection === 'asc' ? 'asc' : 'desc';

    // @TODO: Give entry a type!
    const filterGenres = (entry: any): boolean => {
      if (!this.genreFilters.length) {
        return true;
      }

      return this.genreFilters.every((genre) => includes(entry.genres, genre));
    };

    let { media } = this;

    if (this.adultContentFilter !== 'noFilter') {
      const showOnlyAdult = this.adultContentFilter === 'only';
      media = media.filter((item) => item.isAdult === showOnlyAdult);
    }

    return chain(media)
      .filter((item) => !item.isAdult || (item.isAdult && this.allowAdultContent))
      .map((item) => {
        const outputFormat = item.startDate.day
          ? (this.$t('misc.dates.full') as string)
          : item.startDate.month
          ? (this.$t('misc.dates.monthAndYear') as string)
          : item.startDate.year
          ? (this.$t('misc.dates.yearOnly') as string)
          : undefined;
        const usersListStatus = !!this.aniListData.lists.find(
          (list) => !!list.entries.find((entry: IAniListEntry) => entry.media.id === item.id)
        );

        let dateFormat = '';
        let itemDate = '';

        if (item.startDate.year) {
          dateFormat = 'YYYY';
          itemDate = `${item.startDate.year}`;
        }

        if (item.startDate.month) {
          dateFormat = 'M-YYYY';
          itemDate = `${item.startDate.month}-${item.startDate.year}`;
        }

        if (item.startDate.day) {
          dateFormat = `D-${dateFormat}`;
          itemDate = `${item.startDate.day}-${itemDate}`;
        }
        const startDateTimestamp = moment(itemDate, dateFormat).format('X');
        const startDate = moment(itemDate, dateFormat).format(outputFormat) || this.$t('misc.dates.dateUnknown');
        const coverImage = item.coverImage.extraLarge;

        return {
          id: item.id,
          inList: usersListStatus,
          isAdult: item.isAdult,
          isLocked: item.isLocked,

          isWatching: false,
          isRepeating: false,
          isCompleted: false,
          isDropped: false,
          isPaused: false,
          isPlanning: false,

          title: item.title.userPreferred,
          coverImage,
          episodes: item.episodes || 0,
          genres: item.genres,
          startDateTimestamp,
          startDate,
          studios: item.studios,
        };
      })
      .filter(filterGenres)
      .orderBy((entry) => get(entry, this.sortBy), [sortDirection])
      .value();
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

    if (this.$route.query && this.$route.query.year && this.$route.query.season) {
      const { year, season } = this.$route.query;
      this.seasonYear = parseInt(year as string, 10);
      this.season = this.isValidSeason(season.toString().toUpperCase())
        ? (season.toString().toUpperCase() as AniListSeason)
        : this.getCurrentSeason();
    }

    eventBus.$on('changeSorting', (item: { sortBy: string; direction: string }) => {
      this.sortBy = item.sortBy;
      this.sortDirection = item.direction;
    });

    eventBus.$on('changeFiltering', (item: { genres: string[] }) => {
      this.genreFilters = item.genres;
    });

    eventBus.$on('changeAdultContentFilter', (item: { adultFilter: string }) => {
      this.adultContentFilter = item.adultFilter;
    });

    // Listen to event
    eventBus.$on('updateSeason', async (season: UpdateSeasonProperties) => {
      this.$store.commit('app/setLoadingState', true);
      try {
        const preview = await this.$http.getSeasonPreview(season.year, season.season);
        if (!preview) {
          this.media = [];
        } else {
          this.media = preview.media;
        }
      } catch (error) {
        this.media = [];
      }
      this.$store.commit('app/setLoadingState', false);
    });

    try {
      const preview = await this.$http.getSeasonPreview(this.seasonYear, this.season);
      if (!preview) {
        this.media = [];
      } else {
        this.media = preview.media;
      }
    } catch (error) {
      this.media = [];
    }
  }

  beforeRouteUpdate(to: Route, from: Route, next: any) {
    eventBus.$emit('resetAllSorts');

    const { query } = to;
    if (query.year) {
      this.seasonYear = parseInt(query.year as string, 10);
    }

    if (query.season) {
      const season = (query.season as string).toUpperCase();

      this.season = this.isValidSeason(season) ? (season as AniListSeason) : this.getCurrentSeason();
    }

    next();
  }

  beforeRouteLeave(to: Route, from: Route, next: any) {
    eventBus.$emit('resetAllSorts');
    next();
  }

  getCurrentSeason(): AniListSeason {
    const currentMonth = new Date().getUTCMonth();

    // Spring months
    return currentMonth >= 3 && currentMonth < 6
      ? AniListSeason.SPRING
      : // Summer months
      currentMonth >= 6 && currentMonth < 9
      ? AniListSeason.SUMMER
      : // Fall months
      currentMonth >= 9 && currentMonth < 12
      ? AniListSeason.FALL
      : AniListSeason.WINTER;
  }

  isValidSeason(value: string): boolean {
    return (
      [AniListSeason.SPRING, AniListSeason.WINTER, AniListSeason.SUMMER, AniListSeason.FALL].find(
        (item) => item === value.toUpperCase()
      ) !== undefined
    );
  }

  async setStatus({ mediaId, status, entryId }: { mediaId: number; status: AniListListStatus; entryId?: number }) {
    try {
      await this.$store.dispatch('app/setLoadingState', true);
      if (entryId) {
        await this.$http.updateEntryStatus({
          entryId,
          status,
        });
      } else {
        await this.$http.addEntry({
          mediaId,
          status,
        });
      }
    } catch (error) {
      console.error('setStatus failed!', error);
      this.$notify({
        type: 'error',
        title: 'TODO',
        text: 'To be translated...',
      });
    } finally {
      await this.$store.dispatch('app/setLoadingState', false);
    }
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
