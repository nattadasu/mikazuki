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
import { mapGetters } from 'vuex';
import aniListEventHandler from '@/plugins/AniList/eventHandler';
import { refreshTimer } from '@/plugins/refreshTimer';

@Component({
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated']),
    ...mapGetters('app', ['isLoading']),
  },
})
export default class Refresh extends Vue {
  readonly refreshTimer = refreshTimer;
  readonly isAuthenticated!: boolean;
  readonly isLoading!: boolean;

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
    const seconds = (this.timeUntilRefresh % 60).toString().padStart(2, '0');
    const minutes = Math.floor((this.timeUntilRefresh / 60) % 60)
      .toString()
      .padStart(2, '0');
    const hours = Math.floor(this.timeUntilRefresh / 3600)
      .toString()
      .padStart(2, '0');

    return `${hours && hours !== '00' ? `${hours}:` : ''}${minutes}:${seconds}`;
  }

  get timeUntilRefreshPercentage(): number {
    const fullTime = this.refreshTimer.refreshRate * 60;
    const currentTime = this.timeUntilRefresh;

    return (currentTime / fullTime) * 100;
  }

  async refreshData() {
    this.$store.commit('app/setLoadingState', true);

    // AniList
    try {
      this.refreshTimer.restartTimer();
      await aniListEventHandler.refreshAniListData();
    } catch (error) {
      // TODO: Build central error message management
    }

    this.$store.commit('app/setLoadingState', false);
  }
}
</script>
