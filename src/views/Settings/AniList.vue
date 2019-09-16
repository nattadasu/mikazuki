<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-container fill-height grid-list-xl>
        <v-layout
          v-if="!isAuthenticated"
          class="ma-4"
          fill-height
          justify-center
          align-center
        >
          <v-btn color="primary" @click="loginToAniList">
            {{ $t('actions.login') }}
          </v-btn>
        </v-layout>
        <v-layout
          v-else
          fill-height
          justify-center
          align-center
          wrap
        >
          <v-flex
            xs12
            sm5
            text-center
          >
            <v-layout column>
              <v-flex>
                {{ $t('pages.settings.aniList.loggedInAs', [currentUser.name]) }}
              </v-flex>
              <v-flex>
                <v-btn color="red darken-2" @click="logout">
                  {{ $t('actions.logout') }}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex
            xs12
            sm5
            offset-sm2
          >
            <v-text-field
              v-model="currentAniListRefreshRate"
              type="number"
              :min="5"
              :label="$t('pages.settings.aniList.refreshRate')"
              :suffix="$t('pages.settings.aniList.refreshRateSuffix')"
              :hint="$t('pages.settings.aniList.refreshRateHint')"
              persistent-hint
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { map } from 'lodash';
import { format, parse } from 'url';
import request from 'request';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { appStore, userStore } from '@/store';
import { IAniListUser } from '@/modules/AniList/types';

@Component
export default class AniListSettings extends Vue {
  @Prop(String)
  private tabKey!: string;

  private get isAuthenticated(): boolean {
    return userStore && userStore.isAuthenticated;
  }

  private get currentUser(): IAniListUser {
    return userStore.session.user;
  }

  private get currentAniListRefreshRate(): number {
    return userStore.refreshRate;
  }

  private set currentAniListRefreshRate(refreshRate: number) {
    userStore.setRefreshRate(refreshRate);
  }

  private loginToAniList() {
    if (!userStore.isAuthenticated) {
      const oauthConfig = {
        clientId: process.env.VUE_APP_CLIENT_ID,
        clientSecret: process.env.VUE_APP_CLIENT_SECRET,
        redirectUri: process.env.VUE_APP_REDIRECT_HOST,
        authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
        tokenUrl: 'https://anilist.co/api/v2/oauth/token',
        useBasicAuthorizationHeader: true,
      };
      const redirectUri = encodeURIComponent(oauthConfig.redirectUri as string);
      const url = format(`${oauthConfig.authorizationUrl}?client_id=${oauthConfig.clientId}&response_type=token`);

      window.open(url, '_self');
    }
  }

  private async logout() {
    if (!userStore.isAuthenticated) {
      return;
    }

    await appStore.setLoadingState(true);

    await userStore.logout();

    await appStore.setLoadingState(false);

    this.$router.push({ name: 'Home' });
  }
}
</script>
