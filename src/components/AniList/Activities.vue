<template>
  <v-container class="py-0 px-1" fluid>
    <v-row no-gutters>
      <v-col
        v-for="activity in activities"
        :key="activity.id"
        class="lg5-custom"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        xl="2"
      >
        <v-card class="ma-2">
          <ListImage :image-link="activity.coverImage" :ani-list-id="activity.mediaId" name="" />

          <v-card-text>
            <template v-if="activity.completed">
              {{ $t('pages.aniList.home.activities.completed', [activity.title]) }}
            </template>
            <template v-else-if="activity.dropped">
              {{ $t('pages.aniList.home.activities.dropped', [activity.title]) }}
            </template>
            <!-- Watching exclusive -->
            <template v-else-if="activity.plansToWatch">
              {{ $t('pages.aniList.home.activities.plansToWatch', [activity.title]) }}
            </template>
            <template v-else-if="activity.watchedEpisode">
              {{ $t('pages.aniList.home.activities.watchedEpisode', [activity.title, activity.progress]) }}
            </template>
            <template v-else-if="activity.pausedWatching">
              {{ $t('pages.aniList.home.activities.pausedWatching', [activity.title]) }}
            </template>
            <template v-else-if="activity.rewatched">
              {{ $t('pages.aniList.home.activities.rewatched', [activity.title, activity.progress]) }}
            </template>
            <!-- Reading exclusive -->
            <template v-else-if="activity.readChapter">
              {{ $t('pages.aniList.home.activities.readChapter', [activity.title, activity.progress]) }}
            </template>
            <template v-else-if="activity.plansToRead">
              {{ $t('pages.aniList.home.activities.plansToRead', [activity.title]) }}
            </template>
            <template v-else-if="activity.rereadChapter">
              {{ $t('pages.aniList.home.activities.rereadChapter', [activity.title, activity.progress]) }}
            </template>
            <template v-else-if="activity.pausedReading">
              {{ $t('pages.aniList.home.activities.pausedReading', [activity.title]) }}
            </template>
          </v-card-text>

          <v-divider class="mx-4" />

          <v-card-actions>
            <div class="flex-grow-1" />

            <v-chip v-if="activity.isAnime" color="primary">
              {{ $t('pages.aniList.home.activities.badges.anime') }}
            </v-chip>

            <v-chip v-if="activity.isManga" color="accent">
              {{ $t('pages.aniList.home.activities.badges.manga') }}
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import { IAniListActivity, AniListType } from '@/modules/AniList/types';
import { aniListStore } from '@/store';

@Component({ components: { ListImage } })
export default class Activities extends Vue {
  private get activities() {
    return aniListStore.latestActivities.map(activity => ({
      mediaId: activity.media.id,
      isAnime: activity.media.type === AniListType.ANIME,
      isManga: activity.media.type === AniListType.MANGA,
      title: activity.media.title.userPreferred,
      progress: activity.progress,
      createdAt: moment(activity.createdAt).fromNow(),
      coverImage: activity.media.coverImage.extraLarge,
      // Status
      completed: activity.status === 'completed',
      dropped: activity.status === 'dropped',
      // Watching exclusive
      watchedEpisode: activity.status === 'watched episode',
      plansToWatch: activity.status === 'plans to watch',
      pausedWatching: activity.status === 'paused watching',
      rewatched: activity.status === 'rewatched',
      // Reading exclusive
      readChapter: activity.status === 'read chapter',
      plansToRead: activity.status === 'plans to read',
      rereadChapter: activity.status === 'reread chapter',
      pausedReading: activity.status === 'paused reading',
    }));
  }
}
</script>

<style lang="scss" scoped>
@media (min-width: 1480px) and (max-width: 1902px) {
  .lg5-custom[class*="col-"] {
      width: 20% !important;
      max-width: 20% !important;
      flex-basis: 20% !important;
  }
}
</style>
