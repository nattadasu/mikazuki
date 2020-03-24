<template>
  <v-content>
    <v-container fluid class="py-0 px-1">
      <v-row no-gutters>
        <v-col v-for="item in preparedMedia" :key="item.id" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2">
          <v-card raised class="ma-2">
            <ListImage
              :image-link="item.coverImage"
              :name="item.title"
              :ani-list-id="item.id"
              :studios="item.studios"
            />

            <v-card-text>
              <v-layout row fill-height align-center>
                <v-layout column class="px-2" justify-start>
                  <v-flex class="subtitle-1 grey--text">
                    {{ $tc('pages.seasonPreview.episodes', item.episodes) }}
                  </v-flex>
                  <v-flex class="subtitle-1 grey--text">
                    {{ $t('pages.seasonPreview.startDate') }} {{ item.startDate }}
                  </v-flex>
                </v-layout>

                <template v-if="item.isAdult">
                  <v-flex class="mx-2 text-right">
                    <v-divider vertical inset />

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon large color="error" v-on="on">
                          mdi-alert
                        </v-icon>
                      </template>
                      <span>{{ $t('alerts.adultContent') }}</span>
                    </v-tooltip>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>

            <v-card-actions class="icon-actionize">
              <v-row class="pa-1">
                <v-col class="text-center">
                  <v-icon :color="item.isWatching ? 'green' : 'grey darken-2'">
                    mdi-play
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="item.isRepeating ? 'green darken-3' : 'grey darken-2'">
                    mdi-repeat
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="item.isCompleted ? 'blue' : 'grey darken-2'">
                    mdi-check
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="item.isPaused ? 'yellow darken-2' : 'grey darken-2'">
                    mdi-pause
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="item.isDropped ? 'red darken-1' : 'grey darken-2'">
                    mdi-stop
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="item.isPlanning ? '' : 'grey darken-2'">
                    mdi-playlist-plus
                  </v-icon>
                </v-col>
              </v-row>
            </v-card-actions>

            <v-card-actions v-if="isAuthenticated">
              <AddButton :item="item" />
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col v-if="!preparedMedia.length" cols="12" class="text-center display-2 ma-4">
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
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import AddButton from '@/components/AniList/SeasonPreview/AddButton.vue';
import eventBus from '@/eventBus';
import { AniListSeason, IAniListEntry, IAniListMediaListCollection, IAniListSeasonPreviewMedia } from '@/types';

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

  media: IAniListSeasonPreviewMedia[] = [];

  seasonYear: number = new Date().getUTCFullYear();

  season: AniListSeason = this.getCurrentSeason();

  sortDirection: string = 'asc';

  sortBy: string = 'title';

  genreFilters: string[] = [];

  adultContentFilter: string = 'without';

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
