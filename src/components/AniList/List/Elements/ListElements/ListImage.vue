<template>
  <v-img
    :src="imageLink"
    height="250px"
    position="50% 35%"
    class="pointerCursor"
    @click.native="moveToDetails(aniListId)"
  >
    <template v-slot:placeholder>
      <v-container class="pa-0 justify-center fill-height align-center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-container>
    </template>

    <v-container class="fluid pb-1 media-status-indicator">
      <v-row justify="space-between">
        <v-col cols="auto" class="py-0">
          <v-hover v-slot:default="{ hover }">
            <v-chip small :ripple="false" link :color="mediaStatusChipColor">
              <v-expand-x-transition>
                <span v-if="hover || isMobile">{{
                  $t(`misc.aniList.mediaStatus.${item.media.status.toString().toLowerCase()}`)
                }}</span>
              </v-expand-x-transition>

              <v-icon small :right="hover || isMobile">{{ mediaStatusIcon }}</v-icon>
            </v-chip>
          </v-hover>
        </v-col>

        <v-col cols="auto" class="py-0">
          <v-hover v-slot:default="{ hover }">
            <v-chip small :ripple="false" link :color="scoreColor">
              <v-icon small :left="hover || isMobile">mdi-star</v-icon>

              <v-expand-x-transition>
                <span v-if="hover || isMobile">{{ item.entry.score }}</span>
              </v-expand-x-transition>
            </v-chip>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fluid pt-1" v-if="missingEpisodes || nextEpisode">
      <v-row justify="space-between">
        <v-col cols="auto" class="py-0">
          <template v-if="missingEpisodes">
            <v-hover v-slot:default="{ hover }">
              <v-chip small :ripple="false" link color="info darken-2">
                <v-expand-x-transition>
                  <span v-if="hover || isMobile">{{
                    $tc('pages.aniList.list.missingEpisodes', missingEpisodes, [missingEpisodes])
                  }}</span>
                </v-expand-x-transition>

                <v-icon small :right="hover || isMobile">mdi-fast-forward</v-icon>
              </v-chip>
            </v-hover>
          </template>
        </v-col>

        <v-col cols="auto" class="py-0">
          <template v-if="nextEpisode">
            <v-hover v-slot:default="{ hover }">
              <v-chip small :ripple="false" link color="indigo">
                <v-icon small :left="hover || isMobile">mdi-calendar</v-icon>

                <v-expand-x-transition>
                  <span v-if="hover || isMobile">{{ nextEpisode }}</span>
                </v-expand-x-transition>
              </v-chip>
            </v-hover>
          </template>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-if="name" class="fluid fill-height d-flex align-end py-0 anime-image-container">
      <v-row :class="`${darkMode ? 'shadowed' : 'lightened'} ${isMobile ? 'titled-mobile' : 'titled'}`">
        <v-col cols="12" class="pb-2">
          <span class="title">{{ name }}</span>
        </v-col>
        <v-spacer v-if="concatenatedStudios.length" />
        <v-col v-if="concatenatedStudios.length" cols="12" align-self="end">
          <span class="grey--text" :class="{ 'text--darken-4': !darkMode }">{{ concatenatedStudios }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { mapGetters } from 'vuex';
import {
  AniListMediaStatus,
  AniListScoreFormat,
  IAniListMediaStudio,
  IAniListMediaStudioNode,
  ZeroTwoListDataItem,
  IAniListNextAiringEpisode,
  IAniListSession,
} from '@/types';

@Component({
  computed: {
    ...mapGetters('userSettings', ['session']),
  },
})
export default class ListImage extends Vue {
  @Prop(Object) item!: ZeroTwoListDataItem;
  @Prop(Boolean) showStudios!: boolean;
  readonly session!: IAniListSession;

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

  get nextAiringEpisode(): IAniListNextAiringEpisode {
    return this.item.media.nextAiringEpisode;
  }

  get currentProgress(): number {
    return this.item.entry.progress;
  }

  get missingEpisodes(): number {
    const { currentProgress, nextAiringEpisode } = this;

    if (!nextAiringEpisode) {
      return 0;
    }

    const nextEpisode = nextAiringEpisode.episode;

    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - currentProgress > 0 ? nextEpisode - 1 - currentProgress : 0;
  }

  get aniListId(): number {
    return this.item.media.id;
  }

  get name(): string {
    return this.item.media.title.userPreferred;
  }

  get imageLink(): string {
    return this.item.media.coverImage.extraLarge;
  }

  get studios(): IAniListMediaStudio {
    return this.item.media.studios;
  }

  get mediaStatusIcon(): string {
    return this.item.media.status === AniListMediaStatus.CANCELLED
      ? 'mdi-close'
      : this.item.media.status === AniListMediaStatus.NOT_YET_RELEASED
      ? 'mdi-calendar'
      : this.item.media.status === AniListMediaStatus.RELEASING
      ? 'mdi-antenna'
      : 'mdi-check';
  }

  get mediaStatusChipColor(): string {
    return this.item.media.status === AniListMediaStatus.CANCELLED
      ? 'red darken-2'
      : this.item.media.status === AniListMediaStatus.NOT_YET_RELEASED
      ? 'yellow darken-4'
      : this.item.media.status === AniListMediaStatus.RELEASING
      ? 'success darken-2'
      : 'info darken-2';
  }

  get scoreColor(): string {
    const score = this.item.entry.score;
    if (!score) {
      return 'error darken-2';
    }

    const userScoringSystem = this.session.user.mediaListOptions.scoreFormat;

    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 100 < 1 / 3 ? 'error darken-2' : score / 100 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 10 < 1 / 3 ? 'error darken-2' : score / 10 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_5:
        return score / 5 < 1 / 3 ? 'error darken-2' : score / 5 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_3:
        return score <= 1 ? 'error darken-2' : score === 2 ? 'warning darken-2' : 'success darken-2';
      default:
        return 'white';
    }
  }

  get darkMode(): boolean {
    return this.$vuetify.theme.dark;
  }

  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  get concatenatedStudios(): string {
    if (!this.studios || !this.studios.nodes || !this.studios.nodes.length || !this.showStudios) {
      return '';
    }

    let animationStudios = this.studios.nodes
      .filter((item: IAniListMediaStudioNode) => item.isAnimationStudio)
      .map((item: IAniListMediaStudioNode) => item.name);

    if (!animationStudios.length) {
      animationStudios = this.studios.nodes.map((item: IAniListMediaStudioNode) => item.name);
    }

    return animationStudios[0];
  }

  moveToDetails(id: number) {
    const aniListId = id.toString();
    const location: RawLocation = { name: 'DetailView', params: { id: aniListId } };
    this.$router.push(location);
  }
}
</script>

<style lang="scss" scoped>
.pointerCursor {
  cursor: pointer;
}

.anime-image-container {
  & .titled {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }

    position: absolute;
    bottom: 0;
    width: 100%;
    max-height: 52px;

    transition: 0.25s ease-in-out;
  }

  & .titled-mobile {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }

    position: absolute;
    bottom: 0;
    width: 100%;

    transition: 0.25s ease-in-out;
  }

  &:hover > .titled {
    max-height: 75%;

    &.shadowed {
      background-color: rgba(0, 0, 0, 0.85);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.95);
    }
  }
}
</style>
