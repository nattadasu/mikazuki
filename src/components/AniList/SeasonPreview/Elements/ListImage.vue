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
            <v-chip small :ripple="false" link color="info darken-2">
              <v-expand-x-transition>
                <span v-if="hover || isMobile">{{ startDate }}</span>
              </v-expand-x-transition>

              <v-icon small :right="hover || isMobile">mdi-calendar</v-icon>
            </v-chip>
          </v-hover>
        </v-col>

        <v-col cols="auto" class="py-0">
          <v-hover v-slot:default="{ hover }">
            <v-chip small :ripple="false" link :color="mediaStatusChipColor">
              <v-icon small :left="hover || isMobile">{{ mediaStatusIcon }}</v-icon>

              <v-expand-x-transition>
                <span v-if="hover || isMobile">{{
                  $t(`misc.aniList.mediaStatus.${item.status.toString().toLowerCase()}`)
                }}</span>
              </v-expand-x-transition>
            </v-chip>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fluid py-1">
      <v-row justify="space-between">
        <v-col cols="auto" class="py-0">
          <template v-if="nextEpisode">
            <v-hover v-slot:default="{ hover }">
              <v-chip small :ripple="false" link color="indigo">
                <v-expand-x-transition>
                  <span v-if="hover || isMobile">{{ nextEpisode }}</span>
                </v-expand-x-transition>

                <v-icon small :right="hover || isMobile">mdi-skip-next</v-icon>
              </v-chip>
            </v-hover>
          </template>
        </v-col>

        <v-col cols="auto" class="py-0">
          <v-hover v-slot:default="{ hover }">
            <v-chip small :ripple="false" link>
              <v-icon small :left="hover || isMobile">mdi-television-classic</v-icon>

              <v-expand-x-transition>
                <span v-if="hover || isMobile">{{ item.episodes || '?' }}</span>
              </v-expand-x-transition>
            </v-chip>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>

    <v-container class="fluid pt-1" v-if="item.isAdult">
      <v-row justify="space-between">
        <v-col cols="auto" class="py-0"></v-col>

        <v-col cols="auto" class="py-0">
          <v-hover v-slot:default="{ hover }">
            <v-chip small :ripple="false" link color="error darken-2">
              <v-icon small :left="hover || isMobile">mdi-alert</v-icon>

              <v-expand-x-transition>
                <span v-if="hover || isMobile">{{ $t('pages.seasonPreview.adultContent') }}</span>
              </v-expand-x-transition>
            </v-chip>
          </v-hover>
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
import {
  AniListMediaStatus,
  AniListScoreFormat,
  IAniListMediaStudio,
  IAniListMediaStudioNode,
  ZeroTwoListDataItem,
  IAniListNextAiringEpisode,
  IAniListSeasonPreviewMedia,
} from '@/types';
import { userStore } from '@/store';

@Component
export default class ListImage extends Vue {
  @Prop(Object) item!: IAniListSeasonPreviewMedia;
  @Prop(Boolean) showStudios!: boolean;

  get nextEpisode(): string | null {
    return this.item.nextAiringEpisode
      ? this.$root
          .$t('pages.aniList.list.nextAiringEpisode', [
            this.item.nextAiringEpisode.episode,
            moment(this.item.nextAiringEpisode.airingAt, 'X').fromNow(),
          ])
          .toString()
      : null;
  }

  get nextAiringEpisode(): IAniListNextAiringEpisode {
    return this.item.nextAiringEpisode;
  }

  get startDate(): string {
    return moment([this.item.startDate.year, this.item.startDate.month, this.item.startDate.day]).format(
      this.$t('misc.dates.full') as string
    );
  }

  get aniListId(): number {
    return this.item.id;
  }

  get name(): string {
    return this.item.title.userPreferred;
  }

  get imageLink(): string {
    return this.item.coverImage.extraLarge;
  }

  get studios(): IAniListMediaStudio {
    return this.item.studios;
  }

  get mediaStatusIcon(): string {
    return this.item.status === AniListMediaStatus.CANCELLED
      ? 'mdi-close'
      : this.item.status === AniListMediaStatus.NOT_YET_RELEASED
      ? 'mdi-calendar'
      : this.item.status === AniListMediaStatus.RELEASING
      ? 'mdi-antenna'
      : 'mdi-check';
  }

  get mediaStatusChipColor(): string {
    return this.item.status === AniListMediaStatus.CANCELLED
      ? 'red darken-2'
      : this.item.status === AniListMediaStatus.NOT_YET_RELEASED
      ? 'yellow darken-4'
      : this.item.status === AniListMediaStatus.RELEASING
      ? 'success darken-2'
      : 'info darken-2';
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
