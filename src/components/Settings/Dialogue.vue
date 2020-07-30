<template>
  <v-dialog v-model="syncedDialog" max-width="960" scrollable>
    <v-card min-height="500">
      <v-card-title>
        <v-btn icon @click="syncedDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <span class="pl-2">{{ $t('menus.settings.title') }}</span>
      </v-card-title>

      <v-card-text>
        <v-row :dense="isMobile">
          <v-col v-if="!isMobile" cols="12" md="1">
            <v-tooltip right v-for="item in settingsComponents" :key="item.identifier">
              <template #activator="{ on }">
                <v-btn
                  v-on="on"
                  icon
                  elevation="0"
                  :color="activeComponent[item.identifier] ? 'primary' : 'secondary'"
                  @click="activeSettingComponent = item.identifier"
                >
                  <v-icon v-text="item.icon" />
                </v-btn>
              </template>
              <span>{{ item.text }}</span>
            </v-tooltip>
          </v-col>

          <template v-else>
            <v-col cols v-for="item in settingsComponents" :key="item.identifier">
              <v-btn
                v-on="on"
                text
                small
                block
                elevation="0"
                :color="activeComponent[item.identifier] ? 'primary' : 'secondary'"
                @click="activeSettingComponent = item.identifier"
              >
                <v-icon left v-text="item.icon" />
                {{ item.text }}
              </v-btn>
            </v-col>
          </template>

          <v-col cols="12" md="11">
            <transition name="fade" mode="out-in">
              <component :is="activeSettingComponent" />
            </transition>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import AppSettings from './AppSettings.vue';
import AniList from './AniList.vue';
import About from './About.vue';
import Changelog from './Changelog.vue';

@Component({
  components: {
    AppSettings,
    AniList,
    About,
    Changelog,
  },
})
export default class Settings extends Vue {
  @PropSync('dialog', { type: Boolean })
  readonly syncedDialog!: boolean;
  activeSettingComponent: string = 'app-settings';

  get isMobile(): boolean {
    return this.$vuetify.breakpoint.smAndDown;
  }

  get activeComponent() {
    const obj: any = {};
    this.settingsComponents.forEach((item) => {
      obj[item.identifier] = this.activeSettingComponent === item.identifier;
    });

    return obj;
  }

  get settingsComponents() {
    return [
      {
        identifier: 'app-settings',
        icon: 'mdi-cogs',
        text: this.$t('menus.settings.appSettings'),
      },
      {
        identifier: 'ani-list',
        icon: 'mdi-format-list-bulleted-type',
        text: this.$t('menus.settings.aniList'),
      },
      {
        identifier: 'about',
        icon: 'mdi-at',
        text: this.$t('menus.settings.about'),
      },
      {
        identifier: 'changelog',
        icon: 'mdi-newspaper-variant-outline',
        text: this.$t('menus.settings.changelog'),
      },
      {
        identifier: 'special-thanks',
        icon: 'mdi-account-heart',
        text: this.$t('menus.settings.specialThanks'),
      },
    ];
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
