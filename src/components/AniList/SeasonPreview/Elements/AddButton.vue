<template>
  <v-btn v-if="inList || isAdded" block text color="grey">
    <v-icon left color="info">
      mdi-check
    </v-icon>
    {{ $t('actions.added') }}
  </v-btn>
  <v-btn v-else block text :disabled="isLocked" :loading="isLoading" @click="addMediaToPlanList(item)">
    <v-icon left color="success">
      mdi-playlist-plus
    </v-icon>
    {{ $t('actions.add') }}
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListListStatus } from '@/types';
import { userStore, appStore, aniListStore } from '@/store';

@Component
export default class SeasonPreviewAddButton extends Vue {
  @Prop() item!: any;

  isLoading: boolean = false;

  isAdded: boolean = false;

  get inList(): boolean {
    return this.item.inList;
  }

  get isLocked(): boolean {
    return this.item.isLocked;
  }

  async addMediaToPlanList(item: any): Promise<void> {
    await appStore.setLoadingState(true);
    this.isLoading = true;

    try {
      const entry = await this.$http.addEntry({
        mediaId: item.id,
        status: AniListListStatus.PLANNING,
      });

      this.isAdded = true;

      const planningList = aniListStore.aniListData.lists.find((list) => list.status === AniListListStatus.PLANNING);
      planningList?.entries.push(entry);
    } catch (error) {
      this.$notify({
        title: this.$t('errors.updateFailed.title') as string,
        text: this.$t('errors.updateFailed.text') as string,
        type: 'error',
      });
    }

    // eslint-disable-next-line no-param-reassign
    this.isLoading = false;
    await appStore.setLoadingState(false);
  }
}
</script>
