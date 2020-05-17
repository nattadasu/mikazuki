<template>
  <v-speed-dial v-model="fab" bottom right direction="top" transition="slide-y-reverse-transition" absolute fixed>
    <template #activator>
      <v-btn v-model="fab" fab color="blue darken-2">
        <v-icon v-if="fab">mdi-close</v-icon>
        <v-icon v-else>mdi-menu</v-icon>
      </v-btn>
    </template>

    <v-btn fab small color="green" @click="refreshList">
      <v-icon>mdi-sync</v-icon>
    </v-btn>

    <v-tooltip left>
      <template #activator="{ on }">
        <v-btn fab small color="info" v-on="on" @click="jumpToTop">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('actions.toPageTop') }}</span>
    </v-tooltip>
  </v-speed-dial>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import aniListEventHandler from '@/plugins/AniList/eventHandler';

@Component
export default class FAB extends Vue {
  fab: boolean = false;

  refreshList() {
    aniListEventHandler.refreshLists();
  }

  jumpToTop(): void {
    window.scrollTo(0, 0);
  }
}
</script>
