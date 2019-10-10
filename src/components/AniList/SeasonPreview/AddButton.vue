<template>
  <v-btn
    v-if="inList || isAdded"
    block
    text
    color="grey"
  >
    <v-icon left color="info">
      mdi-check
    </v-icon>
    {{ $t('actions.added') }}
  </v-btn>
  <v-btn
    v-else
    block
    text
    :disabled="isLocked"
    :loading="isLoading"
    @click="addMediaToPlanList(item)"
  >
    <v-icon left color="success">
      mdi-playlist-plus
    </v-icon>
    {{ $t('actions.addToPlanToWatch') }}
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListListStatus } from '@/modules/AniList/types';
import AniListAPI from '@/modules/AniList/API';
import { userStore, appStore } from '@/store';

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
      const response = await AniListAPI.addEntry(item.id, AniListListStatus.PLANNING);

      if (response) {
        this.isAdded = true;

        // We don't want to reload everytime a media is added to planned list
        // so we just set the refresh timer to half a minute, which is enough time
        // to think about adding another anime to the planned list which then resets the timer again
        const tempRefreshRate = userStore.refreshRate;
        await userStore.setRefreshRate(0.5);
        await userStore.restartRefreshTimer();
        await userStore.setRefreshRate(tempRefreshRate);
      }
    } catch (error) {
      //
    }

    // eslint-disable-next-line no-param-reassign
    this.isLoading = false;
    await appStore.setLoadingState(false);
  }
}
</script>
