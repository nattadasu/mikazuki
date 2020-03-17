<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-card-text>
        <v-container fill-height grid-list-xl>
          <v-layout v-if="!isAuthenticated" class="ma-4" fill-height justify-center align-center>
            <v-btn color="primary" @click="loginToAniList">
              {{ $t('actions.login') }}
            </v-btn>
          </v-layout>
          <v-layout v-else fill-height justify-center align-center wrap>
            <v-flex xs12 sm5 text-center>
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
            <v-flex xs12 sm5 offset-sm2>
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
      </v-card-text>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { map } from 'lodash';
import { format, parse } from 'url';
import request from 'request';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { refreshTimer } from '@/plugins/refreshTimer';
import { appStore, userStore } from '@/store';
import { IAniListUser } from '@/types';

@Component
export default class AniListSettings extends Vue {
  @Prop(String)
  tabKey!: string;

  get isAuthenticated(): boolean {
    return userStore && userStore.isAuthenticated;
  }

  get currentUser(): IAniListUser {
    return userStore.session.user;
  }

  get currentAniListRefreshRate(): number {
    return userStore.refreshRate;
  }

  set currentAniListRefreshRate(refreshRate: number) {
    userStore.setRefreshRate(refreshRate);
  }

  loginToAniList() {
    if (!userStore.isAuthenticated) {
      const oauthConfig = {
        clientId: process.env.VUE_APP_CLIENT_ID,
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

  async logout() {
    if (!userStore.isAuthenticated) {
      return;
    }

    await appStore.setLoadingState(true);

    await userStore.logout();

    await appStore.setLoadingState(false);

    this.$router.push({ name: 'Home' });
  }

  @Watch('currentAniListRefreshRate')
  onCurrentAniListRefreshRateChange(item: number | undefined) {
    if (item !== undefined) {
      refreshTimer.setRefreshRate(item);
      refreshTimer.restartTimer();
    }
  }
}
</script>
