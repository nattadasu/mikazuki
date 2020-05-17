<template>
  <v-dialog v-model="syncedDialog">
    <v-card>
      <v-card-title>
        <v-btn icon @click="syncedDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <span class="pl-2">{{ $t('menus.settings.title') }}</span>
      </v-card-title>

      <v-card-text>
        <div class="grid-wrapper">
          <div class="grid-menu">
            <v-btn
              block
              small
              rounded
              elevation="0"
              :outlined="activeSettingComponent !== item.identifier"
              color="primary"
              v-for="item in settingsComponents"
              :key="item.identifier"
              @click="activeSettingComponent = item.identifier"
            >
              {{ item.text }}
            </v-btn>
          </div>

          <div class="grid-content">
            <component :is="activeSettingComponent" />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import AppSettings from './AppSettings.vue';

@Component({
  components: {
    AppSettings,
  },
})
export default class Settings extends Vue {
  @PropSync('dialog', { type: Boolean })
  readonly syncedDialog!: boolean;

  activeSettingComponent: string = 'app-settings';

  get settingsComponents() {
    return [
      {
        identifier: 'app-settings',
        text: this.$t('menus.settings.appSettings'),
      },
      {
        identifier: 'ani-list',
        text: this.$t('menus.settings.aniList'),
      },
      {
        identifier: 'about',
        text: this.$t('menus.settings.about'),
      },
      {
        identifier: 'changelog',
        text: this.$t('menus.settings.changelog'),
      },
      {
        identifier: 'special-thanks',
        text: this.$t('menus.settings.specialThanks'),
      },
    ];
  }
}
</script>

<style scoped lang="scss">
.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.grid-menu {
  grid-column: 1 / 2;

  & > :not(:first-child) {
    margin-top: 8px;
  }
}

.grid-content {
  grid-column: 2 / 7;
}
</style>
