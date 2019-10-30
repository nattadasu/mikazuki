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
              <div class="title">
                {{ $t('pages.aniList.home.activities.headline') }}
              </div>
              <Activities />
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
        this.$router.replace({ name: 'Home' });
      }

      await userStore.setSession(accessToken as string);
      this.$router.replace({ name: 'Home' });
    }
  }

  get currentUser() {
    return userStore.session.user;
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
