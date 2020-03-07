<template>
  <v-card-actions class="icon-actionize py-1">
    <v-select solo hide-details dense flat :items="items" v-model="itemListStatus" menu-props="auto, offset-y" />

    <v-btn color="success" class="ml-1" small text :disabled="!canPressAddButton">
      <v-icon left>mdi-plus</v-icon>
      {{ buttonText }}
    </v-btn>
  </v-card-actions>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import { AniListListStatus, IAniListSeasonPreviewMedia } from '@/types';
import { userStore, appStore, aniListStore } from '@/store';

@Component
export default class SeasonPreviewAddButton extends Vue {
  @Prop() item!: IAniListSeasonPreviewMedia;
  itemListStatus: AniListListStatus = AniListListStatus.PLANNING;

  created() {
    if (this.item.mediaListEntry && this.item.mediaListEntry.status !== AniListListStatus.PLANNING) {
      this.itemListStatus = this.item.mediaListEntry.status;
    }
  }

  get canPressAddButton(): boolean {
    if (!this.item.mediaListEntry) {
      return true;
    }

    return !(this.item.mediaListEntry.status === this.itemListStatus);
  }

  get buttonText(): string {
    if (this.canPressAddButton) {
      return this.$t('actions.add') as string;
    }

    return this.$t('actions.added') as string;
  }

  get items() {
    return [
      {
        text: this.$root.$t('misc.aniList.listStatusses.watching'),
        value: AniListListStatus.CURRENT,
      },
      {
        text: this.$root.$t('misc.aniList.listStatusses.completed'),
        value: AniListListStatus.COMPLETED,
      },
      {
        text: this.$root.$t('misc.aniList.listStatusses.dropped'),
        value: AniListListStatus.DROPPED,
      },
      {
        text: this.$root.$t('misc.aniList.listStatusses.paused'),
        value: AniListListStatus.PAUSED,
      },
      {
        text: this.$root.$t('misc.aniList.listStatusses.planning'),
        value: AniListListStatus.PLANNING,
      },
      {
        text: this.$root.$t('misc.aniList.listStatusses.repeating'),
        value: AniListListStatus.REPEATING,
      },
    ];
  }

  // async addMediaToPlanList(item: any): Promise<void> {
  //   await appStore.setLoadingState(true);
  //   this.isLoading = true;

  //   try {
  //     const entry = await this.$http.addEntry({
  //       mediaId: item.id,
  //       status: AniListListStatus.PLANNING,
  //     });

  //     this.isAdded = true;

  //     const planningList = aniListStore.aniListData.lists.find((list) => list.status === AniListListStatus.PLANNING);
  //     planningList?.entries.push(entry);
  //   } catch (error) {
  //     this.$notify({
  //       title: this.$t('errors.updateFailed.title') as string,
  //       text: this.$t('errors.updateFailed.text') as string,
  //       type: 'error',
  //     });
  //   }

  //   // eslint-disable-next-line no-param-reassign
  //   this.isLoading = false;
  //   await appStore.setLoadingState(false);
  // }
}
</script>
