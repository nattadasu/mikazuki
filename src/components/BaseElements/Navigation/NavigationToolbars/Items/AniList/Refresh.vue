<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn v-if="isAuthenticated" text icon v-on="{ ...toolTip }" @click="refreshData">
        <v-progress-circular :rotate="-90" :width="2" :color="colorCode" :value="timeUntilRefreshPercentage">
          <v-icon style="vertical-align: text-top" size="18"> mdi-sync {{ isLoading ? 'mdi-spin' : '' }} </v-icon>
        </v-progress-circular>
      </v-btn>
    </template>
    <span>({{ timerText }})</span>
  </v-tooltip>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { appStore, userStore } from '@/store';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import { refreshTimer } from '@/plugins/refreshTimer';

@Component
export default class Refresh extends Vue {
  readonly refreshTimer = refreshTimer;

  get isAuthenticated(): boolean {
    return userStore.isAuthenticated;
  }

  get isLoading(): boolean {
    return appStore.isLoading;
  }

  get colorCode(): string {
    if (this.timeUntilRefreshPercentage < 60 && this.timeUntilRefreshPercentage > 30) {
      return 'warning';
    }
    if (this.timeUntilRefreshPercentage < 30) {
      return 'error';
    }
    return 'success';
  }

  get timeUntilRefresh(): number {
    return this.refreshTimer.timeUntilRefresh;
  }

  get timerText(): string {
    const time = this.timeUntilRefresh * 1000;

    return moment(time).format('mm:ss');
  }

  get timeUntilRefreshPercentage(): number {
    const fullTime = this.refreshTimer.refreshRate * 60;
    const currentTime = this.timeUntilRefresh;

    return (currentTime / fullTime) * 100;
  }

  async refreshData() {
    await appStore.setLoadingState(true);

    // AniList
    try {
      this.refreshTimer.restartTimer();
      await aniListEventHandler.refreshAniListData();
    } catch (error) {
      // TODO: Build central error message management
    }

    await appStore.setLoadingState(false);
  }
}
</script>
