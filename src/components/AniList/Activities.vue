<template>
  <v-container class="py-0 px-1" fluid>
    <v-row>
      <v-col cols="12" lg="6" v-for="activity in activities" :key="activity.id">
        <v-row no-gutters>
          <v-col cols="auto" class="flex-shrink-1">
            <v-img height="150" width="150" class="first border-radius" :src="activity.coverImage" />
          </v-col>

          <v-col :cols="true" class="grey second border-radius darken-3 flex-grow-1">
            <v-card-title class="headline">
              {{ activity.userName }}

              <v-spacer />
              <div class="caption">
                {{ activity.createdAt }}
              </div>
            </v-card-title>

            <v-card-subtitle>
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
                {{ $t('pages.aniList.home.activities.rewatchedEpisode', [activity.title, activity.progress]) }}
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
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import { IAniListActivity, AniListType } from '@/types';
import { aniListStore } from '@/store';

@Component({ components: { ListImage } })
export default class Activities extends Vue {
  get activities() {
    return aniListStore.latestActivities.map((activity) => ({
      id: activity.id,
      mediaId: activity.media.id,
      isAnime: activity.media.type === AniListType.ANIME,
      isManga: activity.media.type === AniListType.MANGA,
      title: activity.media.title.userPreferred,
      progress: activity.progress,
      userName: activity.user.name,
      createdAt: moment(activity.createdAt * 1000).fromNow(),
      coverImage: activity.media.coverImage.extraLarge,
      // Status
      completed: activity.status === 'completed',
      dropped: activity.status === 'dropped',
      // Watching exclusive
      watchedEpisode: activity.status === 'watched episode',
      plansToWatch: activity.status === 'plans to watch',
      pausedWatching: activity.status === 'paused watching',
      rewatched: activity.status === 'rewatched episode',
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
  .lg5-custom[class*='col-'] {
    width: 20% !important;
    max-width: 20% !important;
    flex-basis: 20% !important;
  }
}

.border-radius {
  &.second {
    border-radius: 0 1em 1em 0;
  }

  &.first {
    border-radius: 1em 0 0 1em;
  }
}
</style>
