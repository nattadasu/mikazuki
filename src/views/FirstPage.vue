<template>
  <v-content>
    <v-container fluid class="text-center">
      <h1>{{ $t('alerts.unauthenticated') }}</h1>
    </v-container>
    <v-container fluid class="fill-height justify-content-center">
      <v-btn color="primary" @click="loginToAniList">
        {{ $t('actions.login') }}
      </v-btn>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { format } from 'url';
import { userStore } from '@/store';

@Component
export default class FirstPage extends Vue {
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
}
</script>
