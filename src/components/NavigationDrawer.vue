<template>
  <v-navigation-drawer
    app
    :expand-on-hover="true"
    :mini-variant="true"
    :right="$vuetify.rtl"
    :permanent="true"
    :src="userBackground"
    :style="customStyling"
  >
    <v-list dense nav>
      <v-list-item two-line class="px-0">
        <v-list-item-avatar>
          <img :src="userAvatar" v-if="userAvatar" />
          <v-icon v-else>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            <template v-if="userName">  
              {{ userName }}
            </template>
            <template v-else>
              Unauthorized
            </template>
          </v-list-item-title>

          <v-list-item-subtitle v-if="isAuthenticated">
            {{ $t('menus.navigationDrawer.timeUntilNextRefresh', [timerText]) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2" />

      <v-list-item-group v-model="item" :color="listItemHighlightColor">
        <template v-for="(item, index) in menuItems">
          <v-divider v-if="item.title === 'divider'" :key="index" class="my-2" />

          <v-list-item :key="index" :to="item.location" v-else exact>
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>

            <v-list-item-title>
              {{ $t(item.title) }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-list-item-group>

      <v-divider class="my-2" />

      <v-list-item @click="settingsDialogSynced = !settingsDialogSynced">
        <v-list-item-icon>
          <v-icon>mdi-cogs</v-icon>
        </v-list-item-icon>

        <v-list-item-title>
          {{ $t('menus.settings.title') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list-item class="px-2 py-2">
        <v-img
          style="cursor: pointer;"
          min-width="240"
          :src="require('@/assets/logos/Ko-fi-Support-Button.png')"
          @click="openSupportPage"
        />
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { shell } from 'electron';
import Vue from 'vue';
import { RawLocation } from 'vue-router';
import { mapGetters } from 'vuex';
import { refreshTimer, RefreshTimer } from '@/plugins/refreshTimer';
import { IAniListSession } from '@/types';

interface NavigationItem {
  title: string | 'divider';
  location?: RawLocation;
  routeName?: string;
  icon?: string;
}

export default Vue.extend({
  props: {
    settingsDialog: Boolean,
  },
  computed: {
    ...mapGetters('app', [
      'navigationDrawerListItemColor',
      'navigationDrawerBackgroundBrightness',
      'navigationDrawerBackgroundBlurriness',
    ]),
    ...mapGetters('userSettings', ['isAuthenticated', 'session']),
    listItemHighlightColor(): string | undefined {
      return this.navigationDrawerListItemColor === 'auto' ? undefined : this.navigationDrawerListItemColor;
    },
    userBackground(): string {
      return (this.session as IAniListSession).user.bannerImage ?? '';
    },
    userAvatar(): string {
      return (this.session as IAniListSession).user.avatar.medium ?? '';
    },
    userName(): string {
      return (this.session as IAniListSession).user.name ?? '-/-';
    },
    timerText(): string {
      const seconds = (refreshTimer.timeUntilRefresh % 60).toString().padStart(2, '0');
      const minutes = Math.floor((refreshTimer.timeUntilRefresh / 60) % 60)
        .toString()
        .padStart(2, '0');
      const hours = Math.floor(refreshTimer.timeUntilRefresh / 3600)
        .toString()
        .padStart(2, '0');

      return `${hours && hours !== '00' ? `${hours}:` : ''}${minutes}:${seconds}`;
    },
    customStyling() {
      return {
        '--brightness': `${this.navigationDrawerBackgroundBrightness}%`,
        '--blurriness': `${this.navigationDrawerBackgroundBlurriness}px`,
      };
    },
    settingsDialogSynced: {
      get() {
        return this.settingsDialog;
      },
      set(value) {
        this.$emit('update:settings-dialog', value);
      },
    },
  },
  data() {
    const menuItems: NavigationItem[] = [
      {
        title: 'menus.aniList.home',
        location: { name: 'Home' },
        routeName: 'Home',
        icon: 'mdi-home',
      },
      {
        title: 'menus.aniList.seasonPreview',
        location: { name: 'SeasonPreview' },
        routeName: 'SeasonPreview',
        icon: 'mdi-calendar-month',
      },
      {
        title: 'divider',
      },
      {
        title: 'menus.aniList.watching',
        location: { name: 'Watching' },
        routeName: 'Watching',
        icon: 'mdi-play',
      },
      {
        title: 'menus.aniList.repeating',
        location: { name: 'Repeating' },
        routeName: 'Repeating',
        icon: 'mdi-repeat',
      },
      {
        title: 'menus.aniList.completed',
        location: { name: 'Completed' },
        routeName: 'Completed',
        icon: 'mdi-check',
      },
      {
        title: 'menus.aniList.paused',
        location: { name: 'Paused' },
        routeName: 'Paused',
        icon: 'mdi-pause',
      },
      {
        title: 'menus.aniList.dropped',
        location: { name: 'Dropped' },
        routeName: 'Dropped',
        icon: 'mdi-stop',
      },
      {
        title: 'menus.aniList.planning',
        location: { name: 'Planning' },
        routeName: 'Planning',
        icon: 'mdi-clock-outline',
      },
    ];

    return {
      menuItems,
      item: 0,
    };
  },
  methods: {
    openSupportPage() {
      if (process.env.IS_ELECTRON) {
        shell.openExternal('https://ko-fi.com/nicoaiko');
      } else {
        window.open('https://ko-fi.com/nicoaiko', '_blank');
      }
    },
  },
});
</script>

<style lang="scss">
.v-navigation-drawer__image {
  -webkit-filter: blur(var(--blurriness)) brightness(var(--brightness));
  filter: blur(var(--blurriness)) brightness(var(--brightness));
}
</style>
