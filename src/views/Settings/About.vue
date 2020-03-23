<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-card-text class="px-0">
        <v-container fill-height>
          <v-row align="center" justify="center">
            <v-col cols="12">
              <h2 class="display-3 text-center">
                {{ $t('pages.settings.about.version') }}
              </h2>
              <h3 class="display-2 text-center">
                {{ currentAppVersion }}
              </h3>
            </v-col>

            <v-col cols="3" class="text-center">
              <a :href="githubPage" target="_blank" class="headline">
                <v-img :src="require('@/assets/logos/github-logo.png')" alt="GitHub">
                  <template v-slot:placeholder>
                    <v-row align="center" justify="center" ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </a>
            </v-col>

            <v-col cols="3" class="text-center">
              <a :href="discordPage" target="_blank" class="headline">
                <v-img :src="require('@/assets/logos/discord-blurple-logo.png')" alt="Discord">
                  <template v-slot:placeholder>
                    <v-row align="center" justify="center" ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </a>
            </v-col>

            <v-col cols="3" class="text-center">
              <a :href="appHomepage" target="_blank" class="headline">
                <v-img :src="require('@/assets/logos/AppIcon.png')" alt="Mikazuki">
                  <template v-slot:placeholder>
                    <v-row align="center" justify="center" ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </a>
            </v-col>

            <v-col cols="3" class="text-center">
              <a :href="aniListPage" target="_blank" class="headline">
                <v-img :src="require('@/assets/logos/AniListLogo.svg')" alt="AniList">
                  <template v-slot:placeholder>
                    <v-row align="center" justify="center" ma-0>
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </a>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { version } from '../../../package.json';

@Component
export default class AboutSettings extends Vue {
  @Prop(String) tabKey!: string;
  githubPage: URL = new URL('https://github.com/nicoaiko/mikazuki');
  discordPage: URL = new URL('https://discord.gg/sTpR4Gw');
  appHomepage: URL = new URL('https://www.mikazuki.moe');
  aniListPage: URL = new URL('https://anilist.co');

  get currentAppVersion(): string {
    return version;
  }

  openGitHub() {
    window.open(this.githubPage.toString(), '_blank');
  }

  openDiscord() {
    window.open(this.discordPage.toString(), '_blank');
  }

  openAniList() {
    window.open(this.aniListPage.toString(), '_blank');
  }
}
</script>
