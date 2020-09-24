<script lang="ts">
import { chain } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import ListImage from './Elements/ListImage.vue';
import ProgressBar from './Elements/ProgressBar.vue';
import { Getter } from '@/decorators';
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
  updateTimer: NodeJS.Timeout | null = null;
  updatePayload: any[] = [];
  readonly updateInterval = 750;

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

  increaseEpisode(entryId: number): void {
    const listEntry = this.listData.find((entry) => entry.id === entryId);

    if (!listEntry) {
      return;
    }

    const { currentProgress, episodeAmount } = listEntry;

    if (episodeAmount !== '?' && currentProgress + 1 >= episodeAmount) {
      listEntry.status = AniListListStatus.COMPLETED;
    }

    listEntry.currentProgress++;
    this.startUpdateTimer(listEntry);
  }

  startUpdateTimer(entry: any) {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const now = Date.now();
    const uploadEntry = {
      id: entry.id,
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

    function groupBy1<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
      const map = new Map<K, Array<V>>();

      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);

        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });

      return map;
    }

    function groupBy(items: any[], key: string) {
      return items.reduce(
        (result, item) => ({
          ...result,
          [item[key]]: [...(result[item[key]] || []), item],
        }),
        {}
      );
    }

    const grouped = groupBy(this.updatePayload, 'id');

    console.log(grouped);
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
        <v-col v-for="item in listData" class="lg5-custom" cols="12" sm="6" md="4" lg="3" xl="2" :key="item.id">
          <v-lazy :value="false" :options="{ threshold: 0.5 }">
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
