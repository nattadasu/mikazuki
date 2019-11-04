<template>
  <v-content>
    <div class="d-flex flex-column">
      <v-card v-if="isAuthenticated" flat style="background: transparent;">
        <v-card-text class="background" :style="`background-image: url(${currentUser.bannerImage})`">
          <v-container fluid>
            <v-row>
              <v-col cols="8" sm="6" md="4" lg="3" xl="2">
                <ProfileImage />
              </v-col>

              <v-col cols="4" sm="3" offset="0" offset-sm="2" offset-md="5" offset-lg="6" offset-xl="7">
                <v-img
                  class="pointer-on-hover"
                  :src="require('@/assets/logos/Ko-fi-Support-Button.png')"
                  @click="openSupportPage"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
      <v-container v-if="isAuthenticated" class="fill-height" style="flex-grow: 1" fluid>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="12" md="9" lg="6">
              <!--              <div class="title">-->
              <!--                {{ $t('pages.aniList.home.activities.headline') }}-->
              <!--              </div>-->
              <Activities />
            </v-col>

            <v-col cols="12" md="3" lg="6">
              <v-row>
                <v-col cols="12" lg="6">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <div class="title text-center">
                            {{ currentUser.statistics.anime.count }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.totalAnime') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ daysWatched }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.daysWatched') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ animeMeanScore }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.meanScore') }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="grey px-4" :class="[$vuetify.theme.dark ? 'darken-4' : 'lighten-4']">
                      <v-row>
                        <v-col
                          cols="4"
                          v-for="(item, index) in animeSliderLabels"
                          :key="`anime_activity_slider_${index}`"
                          :class="{
                            'text-left': index === 0,
                            'text-center': index === 1,
                            'text-right': index === 2,
                          }"
                          class="my-0 py-0"
                        >
                          {{ item }}
                        </v-col>
                        <v-col cols="12" class="pb-0 mb-0">
                          <v-progress-linear height="12" rounded :value="animeDaysPercentage" />
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>

                <v-col cols="12" lg="6">
                  <v-card>
                    <v-card-text>
                      <v-row>
                        <v-col>
                          <div class="title text-center">
                            {{ currentUser.statistics.manga.count }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.totalManga') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ currentUser.statistics.manga.chaptersRead }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.chaptersRead') }}
                            </div>
                          </div>
                        </v-col>

                        <v-col>
                          <div class="title text-center">
                            {{ mangaMeanScore }}
                            <div class="caption">
                              {{ $t('pages.aniList.home.activities.statistics.meanScore') }}
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="grey px-4" :class="[$vuetify.theme.dark ? 'darken-4' : 'lighten-4']">
                      <v-row>
                        <v-col
                          cols="4"
                          v-for="(item, index) in mangaSliderLabels"
                          :key="`manga_activity_slider_${index}`"
                          :class="{
                            'text-left': index === 0,
                            'text-center': index === 1,
                            'text-right': index === 2,
                          }"
                          class="my-0 py-0"
                        >
                          {{ item }}
                        </v-col>
                        <v-col cols="12" class="pb-0 mb-0">
                          <v-progress-linear height="12" rounded :value="chaptersReadPercentage" />
                        </v-col>
                      </v-row>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
      <v-card v-if="!isAuthenticated" style="flex-grow: 1" tile>
        <v-card-title primary-title>
          <div>
            <div class="headline">
              {{ $t('alerts.unauthenticated') }}
            </div>
            <span class="subheading">{{ $t('pages.aniList.home.howToAuthenticate.header') }}</span>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="body-2">
            <p v-for="(item, index) in $t('pages.aniList.home.howToAuthenticate.text')" :key="index">
              {{ item }}
            </p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Activities from '@/components/AniList/Activities.vue';
import ProfileImage from '@/components/AniList/ProfileImage.vue';
import { userStore } from '@/store';

@Component({
  components: {
    Activities,
    ProfileImage,
  },
})
export default class Home extends Vue {
  async beforeMount() {
    if ('login' in this.$route.query) {
      const { access_token: accessToken } = this.$route.query;

      if (!accessToken) {
        await this.$router.replace({ name: 'Home' });
      }

      await userStore.setSession(accessToken as string);
      await this.$router.replace({ name: 'Home' });
    }
  }

  get currentUser() {
    return userStore.session.user;
  }

  get daysWatched() {
    const { minutesWatched } = this.currentUser.statistics.anime;

    return (minutesWatched / 1440).toFixed(1);
  }

  get animeDaysPercentage() {
    const { minutesWatched } = this.currentUser.statistics.anime;
    const daysWatched = minutesWatched / 1440;

    const over = daysWatched - this.getAnimeDaysWatchedMin;
    const under = this.getAnimeDaysWatchedMax - this.getAnimeDaysWatchedMin;

    return (over / under) * 100;
  }

  get chaptersReadPercentage() {
    const { chaptersRead } = this.currentUser.statistics.manga;

    const over = chaptersRead - this.getMangaChapterMin;
    const under = this.getMangaChapterMax - this.getMangaChapterMin;

    return (over / under) * 100;
  }

  get animeMeanScore() {
    const { meanScore } = this.currentUser.statistics.anime;

    return meanScore.toFixed(1);
  }

  get mangaMeanScore() {
    const { meanScore } = this.currentUser.statistics.manga;

    return meanScore.toFixed(1);
  }

  get getMangaChapterMax() {
    const { chaptersRead } = this.currentUser.statistics.manga;
    let closestThousand = 1000;

    while (closestThousand < chaptersRead) {
      closestThousand += 1000;
    }

    return closestThousand;
  }

  get getMangaChapterMiddle() {
    const { chaptersRead } = this.currentUser.statistics.manga;
    let closestThousand = 1000;

    while (closestThousand < chaptersRead) {
      closestThousand += 1000;
    }

    return closestThousand - 500;
  }

  get getMangaChapterMin() {
    const { chaptersRead } = this.currentUser.statistics.manga;

    if (chaptersRead <= 1000) {
      return 0;
    } else {
      let closestThousand = 1000;

      while (closestThousand < chaptersRead) {
        closestThousand += 1000;
      }

      return closestThousand - 1000;
    }
  }

  get getAnimeDaysWatchedMax() {
    const daysWatched = this.currentUser.statistics.anime.minutesWatched / 1440;

    if (daysWatched > 100 && daysWatched <= 500) {
      let closestHundred = 500;

      while (daysWatched / closestHundred < 1 && closestHundred !== 0) {
        closestHundred -= 100;
      }

      return closestHundred + 100;
    } else if (daysWatched > 500) {
      return daysWatched * 3;
    } else {
      return 100;
    }
  }

  get getAnimeDaysWatchedMiddle() {
    const daysWatched = this.currentUser.statistics.anime.minutesWatched / 1440;

    if (daysWatched > 100 && daysWatched <= 500) {
      let closestHundred = 500;

      while (daysWatched / closestHundred < 1 && closestHundred !== 0) {
        closestHundred -= 100;
      }

      return closestHundred + 50;
    } else if (daysWatched > 500) {
      return daysWatched;
    } else {
      return 100;
    }
  }

  get getAnimeDaysWatchedMin() {
    const daysWatched = this.currentUser.statistics.anime.minutesWatched / 1440;

    if (daysWatched > 100 && daysWatched <= 500) {
      let closestHundred = 500;

      while (daysWatched / closestHundred < 1 && closestHundred !== 0) {
        closestHundred -= 100;
      }

      return closestHundred;
    } else if (daysWatched > 500) {
      return 500;
    } else {
      return 0;
    }
  }

  get mangaSliderLabels() {
    return [this.getMangaChapterMin, this.getMangaChapterMiddle, this.getMangaChapterMax];
  }

  get animeSliderLabels() {
    return [this.getAnimeDaysWatchedMin, this.getAnimeDaysWatchedMiddle, this.getAnimeDaysWatchedMax];
  }

  get isAuthenticated(): boolean {
    return userStore.isAuthenticated;
  }

  openSupportPage(): void {
    window.open('https://ko-fi.com/nicoaiko', '_blank');
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-size: cover;
}
.pointer-on-hover:hover {
  cursor: pointer;
}
</style>
