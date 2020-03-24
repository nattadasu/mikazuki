<template>
  <v-content>
    <v-container fluid class="px-0 py-0">
      <v-row no-gutters>
        <v-col cols="12" class="pa-0">
          <v-card class="no-border-radius" :loading="isLoading">
            <v-card-text>
              <v-container fluid class="pb-0">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="searchInput"
                      :label="$t('pages.search.searchQuery')"
                      prepend-icon="mdi-magnify"
                      @keyup.enter="search"
                    />
                  </v-col>

                  <v-col cols="12" md="8">
                    <template v-if="$vuetify.breakpoint.smAndDown">
                      <v-expansion-panels v-model="panel" accordion>
                        <v-expansion-panel>
                          <v-expansion-panel-header>{{ $t('pages.search.searchFilter') }}</v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <SearchFilter
                              :list-values="listValues"
                              :adult-content="adultContentValue"
                              :genre-values="genreValues"
                              @listValuesChanged="(value) => (listValues = value)"
                              @adultContentValueChanged="(value) => (adultContentValue = value)"
                              @genreValuesChanged="(value) => (genreValues = value)"
                            />
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </template>
                    <template v-else>
                      <SearchFilter
                        :list-values="listValues"
                        :adult-content="adultContentValue"
                        :genre-values="genreValues"
                        @listValuesChanged="(value) => (listValues = value)"
                        @adultContentValueChanged="(value) => (adultContentValue = value)"
                        @genreValuesChanged="(value) => (genreValues = value)"
                      />
                    </template>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn block text color="green" :loading="isLoading" @click="search">
                <v-icon left>
                  mdi-magnify
                </v-icon>
                {{ $t('actions.search') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col
          v-for="result in searchResults"
          :key="result.id"
          class="lg5-custom"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <v-card raised class="ma-2">
            <ListImage
              :image-link="result.coverImage.extraLarge"
              :ani-list-id="result.id"
              :name="result.title.userPreferred"
              :studios="result.studios"
            />

            <v-card-text class="py-0">
              <v-row>
                <v-col cols="4">
                  <template v-if="result.mediaListEntry">
                    <ProgressCircle
                      :entry-id="result.mediaListEntry.id"
                      :status="result.mediaListEntry.status"
                      :progress-percentage="result.progressPercentage"
                      :current-progress="result.mediaListEntry.progress"
                      :episode-amount="result.episodes || '?'"
                      @increase="() => {}"
                    />
                  </template>
                  <template v-else>
                    <ProgressCircle
                      :entry-id="0"
                      :status="null"
                      :progress-percentage="0"
                      :current-progress="0"
                      :episode-amount="result.episodes || '?'"
                      @increase="() => {}"
                    />
                  </template>
                </v-col>
                <v-col cols="8" class="text-right">
                  <v-tooltip v-if="result.isAdult" top>
                    <template v-slot:activator="{ on }">
                      <v-icon large color="error" v-on="on">
                        mdi-alert
                      </v-icon>
                    </template>
                    <span>{{ $t('alerts.adultContent') }}</span>
                  </v-tooltip>

                  <template v-if="result.mediaListEntry">
                    <v-icon color="green" class="pr-1"> mdi-account </v-icon>{{ result.mediaListEntry.score }}
                  </template>
                  <v-icon color="yellow lighten-1" class="pr-1">
                    mdi-account-group
                  </v-icon>
                  {{ result.averageScore || 'n.a.' }}
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="icon-actionize">
              <v-row class="pa-1">
                <v-col class="text-center">
                  <v-icon :color="result.isWatching ? 'green' : 'grey darken-2'">
                    mdi-play
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="result.isRepeating ? 'green darken-3' : 'grey darken-2'">
                    mdi-repeat
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="result.isCompleted ? 'blue' : 'grey darken-2'">
                    mdi-check
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="result.isPaused ? 'yellow darken-2' : 'grey darken-2'">
                    mdi-pause
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="result.isDropped ? 'red darken-1' : 'grey darken-2'">
                    mdi-stop
                  </v-icon>
                </v-col>

                <v-col text-center>
                  <v-icon :color="result.isPlanning ? '' : 'grey darken-2'">
                    mdi-playlist-plus
                  </v-icon>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { mapGetters } from 'vuex';
import AdultToolTip from '@/components/AniList/ListElements/AdultToolTip.vue';
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import ProgressCircle from '@/components/AniList/ListElements/ProgressCircle.vue';
import { AniListListStatus, IAniListSearchResult } from '@/types';
import SearchFilter from '@/components/Search/Filter.vue';

type IAniListExtendedSearchResult = IAniListSearchResult & {
  isWatching: boolean;
  isRepeating: boolean;
  isCompleted: boolean;
  isPlanning: boolean;
  isDropped: boolean;
  isPaused: boolean;
  progressPercentage?: number;
};

@Component({
  components: {
    AdultToolTip,
    ListImage,
    ProgressCircle,
    SearchFilter,
  },
  computed: {
    ...mapGetters(['app/isLoading']),
  },
})
export default class Search extends Vue {
  readonly isLoading!: boolean;

  searchInput: string = '';
  searchResults: IAniListExtendedSearchResult[] = [];
  listValues: AniListListStatus[] = [];
  genreValues = [];
  adultContentValue = 'both';
  panel = null;

  created() {
    if (this.$route.query && this.$route.query.query) {
      this.searchInput = this.$route.query.query as string;

      this.search();
    }
  }

  async search() {
    if (!this.searchInput.length) {
      return;
    }

    const filters = {
      listStatus: this.listValues,
      isAdult: this.adultContentValue,
      genres: this.genreValues,
    };

    try {
      this.$store.commit('app/setLoadingState', true);

      const results = await this.$http.searchAnime(this.searchInput, filters);

      this.searchResults = results.map(
        (result): IAniListExtendedSearchResult => {
          const object = Object.assign(
            {},
            {
              isWatching: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.CURRENT,
              isRepeating: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.REPEATING,
              isCompleted: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.COMPLETED,
              isDropped: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.DROPPED,
              isPaused: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.PAUSED,
              isPlanning: result.mediaListEntry && result.mediaListEntry.status === AniListListStatus.PLANNING,
            },
            result
          );

          this.$store.commit('app/setLoadingState', false);

          if (result.mediaListEntry) {
            return Object.assign(
              {},
              {
                progressPercentage: this.calculateProgressPercentage(result),
              },
              object
            );
          }

          return object;
        }
      );
    } catch (error) {
      this.$notify({
        type: 'error',
        title: 'ERROR',
        text: error,
      });

      this.$store.commit('app/setLoadingState', false);
    }
  }

  calculateProgressPercentage(entry: IAniListSearchResult): number {
    if (!entry.mediaListEntry) {
      return 0;
    }

    const { episodes, nextAiringEpisode } = entry;
    const currentProgress = entry.mediaListEntry.progress;

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

  @Watch('$route')
  onRouteChanged(newRoute: Route, oldRoute: Route) {
    if (newRoute.name !== oldRoute.name) {
      return;
    }
    if (newRoute.query !== oldRoute.query && newRoute.query.query) {
      this.searchInput = newRoute.query.query as string;

      this.search();
    }
  }
}
</script>

<style lang="scss" scoped>
.no-border-radius {
  border-radius: 0;
}
</style>
