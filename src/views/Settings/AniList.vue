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
                  <v-btn color="red darken-2" @click="performLogout">
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
                :rules="[intervalRangeRule]"
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
import { format } from 'url';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { refreshTimer } from '@/plugins/refreshTimer';
import { IAniListSession, IAniListUser } from '@/types';

@Component({
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated', 'session', 'refreshRate']),
  },
})
export default class AniListSettings extends Vue {
  readonly isAuthenticated!: boolean;
  readonly session!: IAniListSession;
  readonly refreshRate!: number;

  intervalRangeRule(value: string): boolean | string {
    const valAsNumber = Number(value);

    return valAsNumber && valAsNumber >= 5 && valAsNumber <= 300
      ? true
      : this.$t('pages.settings.aniList.refreshRateRule').toString();
  }

  @Prop(String)
  tabKey!: string;

  get currentUser(): IAniListUser {
    return this.session.user;
  }

  get currentAniListRefreshRate() {
    return this.refreshRate;
  }

  set currentAniListRefreshRate(refreshRate: number) {
    if (!refreshRate || refreshRate < 5 || refreshRate > 300) {
      return;
    }

    this.$store.dispatch('userSettings/setRefreshRate', refreshRate);
  }

  loginToAniList() {
    if (!this.isAuthenticated) {
      const oauthConfig = {
        clientId: process.env.VUE_APP_CLIENT_ID,
        redirectUri: process.env.VUE_APP_REDIRECT_HOST,
        authorizationUrl: 'https://anilist.co/api/v2/oauth/authorize',
        tokenUrl: 'https://anilist.co/api/v2/oauth/token',
        useBasicAuthorizationHeader: true,
      };
      const url = format(`${oauthConfig.authorizationUrl}?client_id=${oauthConfig.clientId}&response_type=token`);

      window.open(url, '_self');
    }
  }

  async performLogout() {
    if (!this.isAuthenticated) {
      return;
    }

    this.$store.commit('app/setLoadingState', true);

    await this.$store.dispatch('userSettings/logout');

    this.$store.commit('app/setLoadingState', false);

    await this.$router.push({ name: 'Home' });
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
