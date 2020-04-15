<template>
  <v-content>
    <!-- <v-container fluid class="text-center">
      <h1>{{ $t('alerts.unauthenticated') }}</h1>
    </v-container> -->
    <v-container fluid class="fill-height align-start justify-center">
      <h1 class="text-center">{{ $t('alerts.unauthenticated') }}</h1>

      <v-btn color="primary" @click="loginToAniList">
        {{ $t('actions.login') }}
      </v-btn>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { format } from 'url';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated']),
  },
})
export default class FirstPage extends Vue {
  readonly isAuthenticated!: boolean;

  async beforeMount() {
    if ('login' in this.$route.query) {
      const { access_token: accessToken } = this.$route.query;

      if (!accessToken) {
        await this.$router.replace({ name: 'Home' });
      }

      this.$store.commit('userSettings/setSession', accessToken as string);
      await this.$router.replace({ name: 'Home' });
    }
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
}
</script>
