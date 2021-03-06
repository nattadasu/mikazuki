<template>
  <v-content>
    <v-layout wrap>
      <v-flex xs12>
        <Loading v-if="!item" />
        <BannerImage v-if="item && item.bannerImage" :item="item" class="d-none d-md-flex" />
      </v-flex>
    </v-layout>
    <v-container fluid>
      <v-row dense>
        <template v-if="item">
          <v-col cols="12" md="3">
            <CoverImage :cover-image="item.coverImage" />
          </v-col>

          <v-col :cols="12" :md="9">
            <v-row dense>
              <v-col :cols="12" :sm="6" :order="2" :order-md="1" :class="$vuetify.breakpoint.mdAndUp ? 'py-0' : ''">
                <MediaDetails :item="item" />
              </v-col>

              <v-col :cols="12" :sm="6" :order="1" :order-md="2" :class="$vuetify.breakpoint.mdAndUp ? 'py-0' : ''">
                <UserListSettings :item="item" @updated="updateItem" />
              </v-col>
            </v-row>
          </v-col>

          <v-col :cols="12">
            <StreamingService :item="item" />
          </v-col>

          <v-col :cols="12">
            <Description :item="item" />
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import BannerImage from '@/components/AniList/DetailElements/BannerImage.vue';
import CoverImage from '@/components/AniList/DetailElements/CoverImage.vue';
import Description from '@/components/AniList/DetailElements/Description.vue';
import Loading from '@/components/AniList/DetailElements/Loading.vue';
import MediaDetails from '@/components/AniList/DetailElements/MediaDetails.vue';
import StreamingService from '@/components/AniList/DetailElements/StreamingService.vue';
import UserListSettings from '@/components/AniList/DetailElements/UserListSettings.vue';
import { IAniListEntry, IAniListMedia, AniListListStatus } from '@/types';

@Component({
  components: {
    BannerImage,
    CoverImage,
    Description,
    Loading,
    MediaDetails,
    StreamingService,
    UserListSettings,
  },
})
export default class DetailView extends Vue {
  entry: IAniListEntry | null = null;

  async created() {
    this.$store.commit('app/setLoadingState', true);
    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      await this.loadListEntry(aniListId);

      if (!this.entry) {
        return;
      }

      this.$store.commit('aniList/setCurrentMediaTitle', this.entry.media.title.userPreferred);
    } catch (error) {
      this.$store.commit('app/setLoadingState', false);
      this.$router.back();

      return;
    }

    this.$store.commit('app/setLoadingState', false);
  }

  async updateItem(): Promise<void> {
    this.$store.commit('app/setLoadingState', true);

    const aniListId = parseInt(this.$route.params.id, 10);

    try {
      await this.loadListEntry(aniListId);

      if (!this.entry) {
        return;
      }

      this.$store.commit('aniList/setCurrentMediaTitle', this.entry.media.title.userPreferred);
    } catch (error) {
      this.$store.commit('app/setLoadingState', false);
      this.$router.back();

      return;
    }

    this.$store.commit('app/setLoadingState', false);
  }

  async loadListEntry(aniListId: number): Promise<void> {
    try {
      this.entry = await this.$http.getListEntryByMediaId(aniListId);
    } catch (err) {
      const mediaInfo: IAniListMedia = await this.$http.getAnimeInfo(aniListId);
      this.entry = {
        id: 0,
        progress: 0,
        score: 0,
        status: AniListListStatus.PLANNING,
        updatedAt: 0,
        media: mediaInfo,
      };
    }
  }

  get item() {
    if (!this.entry || !this.entry.media) {
      return null;
    }

    const { media } = this.entry;
    const startDate = this.getReadableDate(media.startDate);
    const endDate = this.getReadableDate(media.endDate);
    const startDateBeforeNow: boolean = this.isDateBeforeNow(media.startDate);
    const endDateBeforeNow: boolean = this.isDateBeforeNow(media.endDate);
    const airingTime = this.getAiringDate(startDate, endDate, media, startDateBeforeNow, endDateBeforeNow);

    const synonyms = media.synonyms && media.synonyms.length ? media.synonyms.join(', ') : null;

    const genres = media.genres && media.genres.length ? media.genres.join(', ') : null;

    const listEntry = this.entry.id
      ? {
          progress: this.entry.progress,
          score: this.entry.score,
          status: this.entry.status,
        }
      : null;

    return {
      airingTime,
      bannerImage: media.bannerImage,
      coverImage: media.coverImage.extraLarge,
      description: media.description || this.$t('alerts.noDescription'),
      englishTitle: media.title.english || this.$t('alerts.noEnglishTitle'),
      entryId: this.entry.id,
      episodes: media.episodes || this.$t('alerts.unknown'),
      genres,
      listEntry,
      mediaId: media.id,
      nativeTitle: media.title.native,
      nextAiringEpisode: media.nextAiringEpisode,
      score: media.averageScore || '-',
      streamingEpisodes: media.streamingEpisodes,
      synonyms,
      title: media.title.romaji,
      userPreferredTitle: media.title.userPreferred,
      type: media.type,
    };
  }

  isDateBeforeNow({ day, month, year }: { day: number | null; month: number | null; year: number | null }): boolean {
    const now = moment();

    if (!year && !month && !day) {
      return false;
    }
    if (year && !month && !day) {
      return now.isBefore(moment(year, 'YYYY'));
    }
    if (year && month && !day) {
      return now.isBefore(moment(`${month}-${year}`, 'M-YYYY'));
    }
    if (year && month && day) {
      return now.isBefore(moment(`${day}-${month}-${year}`, 'D-M-YYYY'));
    }
    return false;
  }

  getReadableDate({
    day,
    month,
    year,
  }: {
    day: number | null;
    month: number | null;
    year: number | null;
  }): string | null {
    let format: string = '';

    if (!year && !month && !day) {
      return null;
    }

    if (year && !month && !day) {
      format = this.$t('misc.dates.yearOnly') as string;

      return moment(year, 'YYYY').format(format);
    }

    if (year && month && !day) {
      format = this.$t('misc.dates.monthAndYear') as string;

      return moment(`${month}-${year}`, 'M-YYYY').format(format);
    }

    format = this.$t('misc.dates.full') as string;

    return moment(`${day}-${month}-${year}`, 'D-M-YYYY').format(format);
  }

  getAiringDate(
    startDate: string | null,
    endDate: string | null,
    media: IAniListMedia,
    startDateBeforeNow: boolean,
    endDateBeforeNow: boolean
  ): string {
    let airingTime;

    if (startDate && endDate) {
      if (startDateBeforeNow) {
        if (startDate === endDate) {
          airingTime = this.$t('pages.aniList.detailView.airesOn', [startDate]) as string;
        } else {
          airingTime = this.$t('pages.aniList.detailView.airesFromTo', [startDate, endDate]) as string;
        }
      } else if (!startDateBeforeNow && endDateBeforeNow) {
        airingTime = this.$t('pages.aniList.detailView.airesFromTo', [startDate, endDate]) as string;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (startDate === endDate) {
          airingTime = this.$t('pages.aniList.detailView.airedOn', [startDate]) as string;
        } else {
          airingTime = this.$t('pages.aniList.detailView.airedOnTo', [startDate, endDate]) as string;
        }
      }
    } else if (startDate && !endDate) {
      if (startDateBeforeNow) {
        if (media.startDate.day) {
          airingTime = this.$t('pages.aniList.detailView.airingStartsOnDay', [startDate]) as string;
        } else if (media.startDate.month) {
          airingTime = this.$t('pages.aniList.detailView.airingStartsInMonthYear', [startDate]) as string;
        } else {
          airingTime = this.$t('pages.aniList.detailView.airingStartsInYear', [startDate]) as string;
        }
      } else {
        airingTime = this.$t('pages.aniList.detailView.airingStartedOn', [startDate]) as string;
      }
    } else if (!startDate && endDate) {
      airingTime = this.$t('pages.aniList.detailView.airingWithUnknownStart', [endDate]) as string;
    } else {
      airingTime = this.$t('misc.dates.dateUnknown') as string;
    }

    return airingTime;
  }
}
</script>

<style lang="scss" scoped>
.v-list,
.v-image,
.v-card {
  border-radius: 5px;
}
</style>
