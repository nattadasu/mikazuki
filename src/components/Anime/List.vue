<script lang="ts">
import { chain, reduce } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListImage from './Elements/ListImage.vue';
import ProgressBar from './Elements/ProgressBar.vue';
import { Getter } from '@/decorators';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import { AniListListStatus, IAniListList, IAniListMediaListCollection } from '@/types';

@Component({
  components: {
    ListImage,
    ProgressBar,
  },
})
export default class AnimeList extends Vue {
  @Prop(String) readonly status!: AniListListStatus;
  isLoading: boolean = false;
  // TODO: Use other name and typing to use animelist for other list providers as well
  @Getter('aniList') readonly aniListData!: IAniListMediaListCollection;
  @Getter('app') readonly listItemStartAmount!: number;
  updateTimer: NodeJS.Timeout | null = null;
  updatePayload: any[] = [];
  readonly updateInterval = 750;
  listItemIndex: number = 0;

  get isListEmpty(): boolean {
    return this.listData.length === 0;
  }

  get listData(): any[] {
    const listElement = this.aniListData.lists.find((list) => list.status === this.status);

    if (!listElement) {
      return [];
    }

    return listElement.entries.map((entry) => {
      const { media } = entry;

      return {
        __rendered: false,
        __entry: entry,
        __media: media,
        aniListId: media.id,
        currentProgress: entry.progress,
        episodeAmount: media.episodes || '?',
        id: entry.id,
        // TODO: Use Object with multiple sizes
        imageLink: media.coverImage.extraLarge,
        mediaStatus: media.status,
        nextAiringEpisode: media.nextAiringEpisode,
        score: entry.score,
        status: entry.status,
        studios: media.studios,
        title: media.title.userPreferred,
      };
    });
  }

  get slicedListData(): any[] {
    return this.listData.slice(0, this.listItemStartAmount * (this.listItemIndex + 1));
  }

  created() {
    window.onscroll = this.onScroll;
  }

  async onScroll() {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

    if (bottomOfWindow) {
      if ((this.listItemIndex + 1) * this.listItemStartAmount < this.listData.length) {
        this.listItemIndex++;
      }
    }
  }

  increaseEpisode(entryId: number): void {
    const listEntry = this.listData.find((entry) => entry.id === entryId);

    if (!listEntry) {
      return;
    }

    const { currentProgress, episodeAmount } = listEntry;

    if (episodeAmount !== '?' && currentProgress + 1 >= episodeAmount) {
      listEntry.status = AniListListStatus.COMPLETED;
    }

    listEntry.__entry.progress++;
    listEntry.currentProgress++;
    this.startUpdateTimer(listEntry);
  }

  startUpdateTimer(entry: any) {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const now = Date.now();
    const uploadEntry = {
      entryId: entry.id,
      mediaId: entry.aniListId,
      title: entry.title,
      progress: entry.currentProgress,
      status: entry.status,
      score: entry.score,
      changeFrom: now,
    };

    this.updatePayload.push(uploadEntry);
    this.updateTimer = setTimeout(this.updateChanges, this.updateInterval);
  }

  async updateChanges() {
    if (!this.updatePayload.length) {
      return;
    }

    console.time('chain');

    const entries = chain(this.updatePayload)
      .groupBy('entryId')
      .map((group) =>
        reduce(group, (acc: any, item: any) => (item.changeFrom > acc.changeFrom ? item : acc), { changeFrom: 0 })
      )
      .filter((group) => !!group.entryId)
      .map(async (entry) => {
        const { entryId, status, progress, score } = entry;

        if (!entryId || progress === null) {
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
          entryId,
          progress,
          status,
          score,
          completedAt,
        });
      })
      .value();

    console.timeEnd('chain');

    if (!entries.length) {
      return;
    }

    console.time('Promise all');

    Promise.all(entries)
      .then((results) => {
        if (!results?.length) {
          return;
        }

        results.forEach((result) => {
          if (!result) return;

          const entry = this.listData.find((item) => item.id === result?.id);

          if (!entry) return;

          entry.__entry = Object.assign(entry.__entry, {
            ...result,
          });
          entry.currentProgress = result.progress;
          entry.score = result.score;
          entry.status = result.status;
          console.log(entry);
        });
      })
      .then(() => {
        // TODO: Trigger update notification
        console.log('Updated');
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.updatePayload = [];
        console.timeEnd('Promise all');
      });
  }
}
</script>

<template>
  <v-container fluid class="py-0 px-1" :class="{ 'fill-height': isListEmpty || isLoading }">
    <v-row no-gutters>
      <v-col v-show="isLoading" cols="12" align-self="center">
        <div class="text-center display-3">
          {{ $t('actions.loading') }}
        </div>
      </v-col>

      <v-col v-if="!isLoading && isListEmpty" cols="12">
        <div class="display-3 text-center">
          {{ $t('$vuetify.noDataText') }}
        </div>
      </v-col>

      <template v-if="!isLoading && !isListEmpty">
        <v-col v-for="item in slicedListData" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2" :key="item.id">
          <v-lazy v-model="item.__rendered" :options="{ threshold: 0.5 }">
            <v-card flat outlined class="ma-2" :id="item.id">
              <list-image :item="item" :show-studios="false" />
              <progress-bar :item="item" :status="status" :increase-episode="increaseEpisode" />
            </v-card>
          </v-lazy>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
