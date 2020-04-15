<template>
  <v-tab-item :key="tabKey">
    <v-container fluid class="fill-height">
      <v-card flat width="100%">
        <v-card-text>
          <v-row>
            <v-col cols v-if="!isAuthenticated" justify-self="center">
              <v-btn color="primary" @click="loginToAniList">
                {{ $t('actions.login') }}
              </v-btn>
            </v-col>

            <template v-else>
              <v-col cols="12" sm="6" class="text-center">
                <h2 class="text-center pb-4">{{ $t('pages.settings.aniList.loggedInAs', [currentUser.name]) }}</h2>
                <v-btn color="red darken-2" @click="logout">
                  {{ $t('actions.logout') }}
                </v-btn>
              </v-col>

              <v-col cols="12" sm="6" class="text-center">
                <v-row>
                  <v-col cols>
                    <v-text-field
                      v-model="currentAniListRefreshRate"
                      type="number"
                      :min="5"
                      :label="$t('pages.settings.aniList.refreshRate')"
                      :suffix="$t('pages.settings.aniList.refreshRateSuffix')"
                      :hint="$t('pages.settings.aniList.refreshRateHint')"
                      persistent-hint
                    />
                  </v-col>

                  <v-col cols>
                    <v-text-field
                      v-model="userListItemAmount"
                      type="number"
                      :min="20"
                      :label="$t('pages.settings.aniList.listItemAmount')"
                      :hint="$t('pages.settings.aniList.listItemAmountHint')"
                      persistent-hint
                    />
                  </v-col>
                </v-row>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-tab-item>
</template>

<script lang="ts">
import { format } from 'url';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IAniListUser, IAniListSession } from '@/types';

@Component({
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated', 'session', 'refreshRate', 'listItemAmount']),
  },
})
export default class AniListSettings extends Vue {
  @Prop(String) tabKey!: string;
  readonly isAuthenticated!: boolean;
  readonly session!: IAniListSession;
  readonly refreshRate!: number;
  readonly listItemAmount!: number;

  get currentUser(): IAniListUser {
    return this.session.user;
  }

  get currentAniListRefreshRate(): number {
    return this.refreshRate;
  }

  set currentAniListRefreshRate(refreshRate: number) {
    this.$store.dispatch('userSettings/setRefreshRate', refreshRate);
  }

  get userListItemAmount(): number {
    return this.listItemAmount;
  }

  set userListItemAmount(value: number) {
    this.$store.dispatch('userSettings/setListItemAmount', value);
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
      const redirectUri = encodeURIComponent(oauthConfig.redirectUri as string);
      const url = format(`${oauthConfig.authorizationUrl}?client_id=${oauthConfig.clientId}&response_type=token`);

      window.open(url, '_self');
    }
  }

  async logout() {
    if (!this.isAuthenticated) {
      return;
    }

    await this.$store.dispatch('app/setLoadingState', true);
    await this.$store.dispatch('userSettings/logout');
    await this.$store.dispatch('app/setLoadingState', false);

    await this.$router.push({ name: 'Home' });
  }
}
</script>
