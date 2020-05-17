<template>
  <v-lazy :value="false" :options="{ threshold: 0.25 }" transition="fade-transition">
    <v-card flat outlined>
      <v-img
        :lazy-src="item.media.coverImage.medium"
        :src="item.media.coverImage.large"
        height="250"
        position="50% 35%"
        @click.native="moveToDetails"
        style="cursor: pointer;"
      >
        <template v-slot:placeholder>
          <v-container class="pa-0 justify-center fill-height align-center">
            <v-progress-circular indeterminate color="grey lighten-5" />
          </v-container>
        </template>

        <v-container class="fluid pb-1 media-status-indicator">
          <v-row justify="space-between">
            <v-col cols="auto" class="py-0">
              <media-chip :status="item.media.status" :force-disable-animation="forceDisableAnimation" />
            </v-col>

            <v-col cols="auto" class="py-0">
              <score-chip
                :score="item.score"
                :score-format="session.user.mediaListOptions.scoreFormat"
                :force-disable-animation="forceDisableAnimation"
              />
            </v-col>
          </v-row>
        </v-container>

        <v-container class="fluid pt-1" v-if="missingEpisodes || nextEpisode">
          <v-row justify="space-between">
            <v-col cols="auto" class="py-0">
              <missing-episodes-chip
                :progress="item.progress"
                :next-airing-episode="item.media.nextAiringEpisode"
                :force-disable-animation="forceDisableAnimation"
              />
            </v-col>

            <v-col cols="auto" class="py-0">
              <next-episode-chip
                :next-airing-episode="item.media.nextAiringEpisode"
                :force-disable-animation="forceDisableAnimation"
              />
            </v-col>
          </v-row>
        </v-container>

        <name-container :title="item.media.title.userPreferred" :force-disable-animation="forceDisableAnimation" />
      </v-img>

      <progress-bar :item="item" :status="status" />
    </v-card>
  </v-lazy>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAniListEntry, AniListMediaStatus, IAniListSession, AniListListStatus } from '@/types';
import MediaChip from './MediaChip.vue';
import ScoreChip from './ScoreChip.vue';
import MissingEpisodesChip from './MissingEpisodesChip.vue';
import NextEpisodeChip from './NextEpisodeChip.vue';
import NameContainer from './NameContainer.vue';
import ProgressBar from './ProgressBar.vue';

@Component({
  components: {
    MediaChip,
    ScoreChip,
    MissingEpisodesChip,
    NextEpisodeChip,
    NameContainer,
    ProgressBar,
  },
})
export default class AniListItem extends Vue {
  @Prop(Object) item!: IAniListEntry;
  @Prop(Object) session!: IAniListSession;
  @Prop(String) status!: AniListListStatus;
  @Prop(Boolean) forceDisableAnimation!: boolean;

  get nextEpisode(): string | null {
    return this.item.media.nextAiringEpisode
      ? this.$root
          .$t('pages.aniList.list.nextAiringEpisode', [
            this.item.media.nextAiringEpisode.episode,
            moment(this.item.media.nextAiringEpisode.airingAt, 'X').fromNow(),
          ])
          .toString()
      : null;
  }

  get missingEpisodes(): number {
    const { progress } = this.item;
    const { nextAiringEpisode } = this.item.media;

    if (!nextAiringEpisode) {
      return 0;
    }
    const nextEpisode = nextAiringEpisode.episode;
    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - progress > 0 ? nextEpisode - 1 - progress : 0;
  }

  moveToDetails() {
    this.$router.push({ name: 'DetailView', params: { id: this.item.media.id.toString() } });
  }
}
</script>
