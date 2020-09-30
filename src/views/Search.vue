<template>
  <v-main>
    <v-toolbar>
      <v-col cols="auto" class="py-1">
        <v-text-field
          v-model="searchQuery"
          hide-details
          prepend-icon="mdi-magnify"
          :label="$t('pages.search.searchQuery')"
          single-line
          @keydown.enter="onSearch"
        />
      </v-col>

      <v-col cols="auto" class="py-1">
        <v-select
          v-model="listFilter"
          :items="listValues"
          :label="$t('pages.search.inList.label')"
          menu-props="auto, offset-y"
          single-line
          hide-details
          multiple
          clearable
        />
      </v-col>

      <v-col cols="auto" class="py-1">
        <v-select
          v-model="adultFilter"
          :items="adultValues"
          :label="$t('pages.search.adultContent.label')"
          menu-props="auto, offset-y"
          single-line
          hide-details
        />
      </v-col>

      <v-col cols="auto">
        <v-btn block color="success" :loading="isLoading" @click="onSearch">
          <v-icon left> mdi-magnify </v-icon>
          {{ $t('actions.search') }}
        </v-btn>
      </v-col>
    </v-toolbar>

    <v-container fluid class="py-0 px-1" :class="{ 'fill-height': isListEmpty || isLoading }">
      <v-row no-gutters>
        <v-col v-show="isLoading" cols="12" align-self="center">
          <div class="text-center display-3">
            {{ $t('actions.loading') }}
            <v-progress-circular indeterminate style="vertical-align: super" />
          </div>
        </v-col>

        <v-col v-if="!isLoading && isListEmpty" cols="12">
          <div class="display-3 text-center">
            {{ $t('$vuetify.noDataText') }}
          </div>
        </v-col>

        <template v-if="!isLoading && !isListEmpty">
          <v-col v-for="item in list" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2" :key="item.id">
            <v-card flat outlined class="ma-2" :id="item.id">
              <list-image
                :nameColumnSize="true"
                card-height="450px"
                :item="item"
                :show-studios="false"
                :show-score="false"
              >
                <template #before>
                  <v-col cols="auto" class="pb-2">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-icon
                          v-if="!item.isAdded"
                          v-on="on"
                          color="success"
                          @click.stop.prevent="onAddEntry(item.id)"
                        >
                          mdi-plus
                        </v-icon>
                        <v-icon v-else v-on="on" color="info" @click.stop.prevent="">mdi-check</v-icon>
                      </template>
                      <span v-if="!item.isAdded">{{ $t('actions.addToPlanToWatch') }}</span>
                      <span v-else>{{ $t('actions.added') }}</span>
                    </v-tooltip>
                  </v-col>

                  <v-col v-if="item.isAdult" cols="auto" class="pb-2">
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <v-icon color="error" v-on="on">mdi-alert</v-icon>
                      </template>
                      <span>{{ $t('alerts.adultContent') }}</span>
                    </v-tooltip>
                  </v-col>

                  <v-col cols="12" class="pb-2">
                    <span class="text-body-2 teal--text text--lighten-3">
                      {{ $tc('pages.seasonPreview.episodes', [item.episodes]) }}
                    </span>
                  </v-col>
                </template>
              </list-image>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ListImage from '@/components/Anime/Elements/ListImage.vue';
import { Getter } from '@/decorators';
import { AniListListStatus, IAniListMediaListCollection } from '@/types';

interface SelectItem<T> {
  text: string;
  value: T;
}

@Component({
  components: { ListImage },
})
export default class SearchView extends Vue {
  @Getter('aniList') aniListData!: IAniListMediaListCollection;
  currentListEntryIds: number[] = [];
  isLoading: boolean = false;
  searchResults: any[] = [];
  searchQuery: string = '';
  listFilter: AniListListStatus[] = [];
  adultFilter: number = 1;
  listValues: SelectItem<AniListListStatus>[] = [
    {
      text: this.$t('misc.aniList.listStatusses.watching').toString(),
      value: AniListListStatus.CURRENT,
    },
    {
      text: this.$t('misc.aniList.listStatusses.repeating').toString(),
      value: AniListListStatus.REPEATING,
    },
    {
      text: this.$t('misc.aniList.listStatusses.completed').toString(),
      value: AniListListStatus.COMPLETED,
    },
    {
      text: this.$t('misc.aniList.listStatusses.paused').toString(),
      value: AniListListStatus.PAUSED,
    },
    {
      text: this.$t('misc.aniList.listStatusses.dropped').toString(),
      value: AniListListStatus.DROPPED,
    },
    {
      text: this.$t('misc.aniList.listStatusses.planning').toString(),
      value: AniListListStatus.PLANNING,
    },
  ];
  adultValues: SelectItem<number>[] = [
    {
      text: this.$t('pages.search.adultContent.onlyNonAdult').toString(),
      value: 1, // 001
    },
    {
      text: this.$t('pages.search.adultContent.onlyAdult').toString(),
      value: 2, // 010
    },
    {
      text: this.$t('pages.search.adultContent.both').toString(),
      value: 4, // 100
    },
  ];

  get isListEmpty(): boolean {
    return this.searchResults.length === 0;
  }

  get list() {
    return this.searchResults.map((result) => {
      const isAdded = this.currentListEntryIds.includes(result.id);

      return {
        __entry: result.mediaListEntry,
        title: result.title.userPreferred,
        imageLink: result.coverImage.extraLarge,
        episodes: result.episodes || '?',
        isAdult: result.isAdult,
        currentProgress: result.mediaListEntry?.progress,
        score: result.mediaListEntry?.score,
        status: result.mediaListEntry?.status,
        entryId: result.mediaListEntry?.id,
        id: result.id,
        aniListId: result.id, // This is a fallback to get the navigation to details working
        isAdded,
      };
    });
  }

  created() {
    this.currentListEntryIds = this.aniListData.lists
      .map((list) => {
        const ids = list.entries.map((entry) => entry.media.id);

        return ids;
      })
      .flat();
  }

  async onSearch() {
    this.isLoading = true;
    const isAdult = !!(this.adultFilter & 2) || this.adultFilter & 4 ? undefined : false;
    const onList = !!this.listFilter.length || undefined;

    const filters = {
      onList,
      isAdult,
    };

    try {
      let results = await this.$http.searchAnime(this.searchQuery, filters);

      if (this.listFilter.length) {
        results = results.filter((result) => this.listFilter.includes(result.mediaListEntry.status));
      }

      this.searchResults = results;
    } catch (error) {
      this.$notify({
        type: 'error',
        title: this.$t('errors.updateFailed.title').toString(),
        text: this.$t('errors.updateFailed.text').toString(),
      });
    } finally {
      this.isLoading = false;
    }
  }

  async onAddEntry(id: number) {
    try {
      const entry = await this.$http.addEntry({
        mediaId: id,
        status: AniListListStatus.PLANNING,
      });

      this.currentListEntryIds.push(id);

      this.$notify({
        title: this.$t('notifications.aniList.successTitle').toString(),
        text: this.$t('notifications.aniList.addedToList', [entry.media.title.userPreferred]).toString(),
      });
    } catch (error) {
      this.$notify({
        type: 'error',
        title: this.$t('errors.updateFailed.title').toString(),
        text: this.$t('errors.updateFailed.text').toString(),
      });
    }
  }
}
</script>
