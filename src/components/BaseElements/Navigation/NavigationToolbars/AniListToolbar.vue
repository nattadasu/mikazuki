<template>
  <v-toolbar-items>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: toolTip }">
        <v-btn text exact :to="{ name: 'Home' }" v-on="{ ...toolTip }">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('menus.aniList.home') }}</span>
    </v-tooltip>

    <template v-if="isAuthenticated">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text exact :to="{ name: 'Watching' }" v-on="{ ...toolTip }">
            <v-icon color="green">
              mdi-play
            </v-icon>
            ({{ watchingAmount }})
          </v-btn>
        </template>
        <span>{{ $t('menus.aniList.watching') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text exact :to="{ name: 'Repeating' }" v-on="{ ...toolTip }">
            <v-icon color="green darken-3">
              mdi-repeat
            </v-icon>
            ({{ repeatingAmount }})
          </v-btn>
        </template>
        <span>{{ $t('menus.aniList.repeating') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text exact :to="{ name: 'Completed' }" v-on="{ ...toolTip }">
            <v-icon color="blue">
              mdi-check
            </v-icon>
            ({{ completedAmount }})
          </v-btn>
        </template>
        <span>{{ $t('menus.aniList.completed') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text exact :to="{ name: 'Paused' }" v-on="{ ...toolTip }">
            <v-icon color="yellow darken-2">
              mdi-pause
            </v-icon>
            ({{ pausedAmount }})
          </v-btn>
        </template>
        <span>{{ $t('menus.aniList.paused') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text exact :to="{ name: 'Dropped' }" v-on="{ ...toolTip }">
            <v-icon color="red darken-1">
              mdi-stop
            </v-icon>
            ({{ droppedAmount }})
          </v-btn>
        </template>
        <span>{{ $t('menus.aniList.dropped') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn text exact :to="{ name: 'Planning' }" v-on="{ ...toolTip }">
            <v-icon>mdi-playlist-plus</v-icon> ({{ planningAmount }})
          </v-btn>
        </template>
        <span>{{ $t('menus.aniList.planning') }}</span>
      </v-tooltip>
    </template>
  </v-toolbar-items>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { AniListListStatus, IAniListMediaListCollection } from '@/types';

@Component({
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated']),
    ...mapGetters('aniList', ['aniListData']),
  },
})
export default class AniListToolbar extends Vue {
  readonly isAuthenticated!: boolean;
  readonly aniListData!: IAniListMediaListCollection;

  get watchingAmount(): number {
    const status: AniListListStatus = AniListListStatus.CURRENT;
    const element = this.aniListData.lists.find((list) => list.status === status);

    return element ? element.entries.length : 0;
  }

  get repeatingAmount(): number {
    const status: AniListListStatus = AniListListStatus.REPEATING;
    const element = this.aniListData.lists.find((list) => list.status === status);

    return element ? element.entries.length : 0;
  }

  get completedAmount(): number {
    const status: AniListListStatus = AniListListStatus.COMPLETED;
    const element = this.aniListData.lists.find((list) => list.status === status);

    return element ? element.entries.length : 0;
  }

  get pausedAmount(): number {
    const status: AniListListStatus = AniListListStatus.PAUSED;
    const element = this.aniListData.lists.find((list) => list.status === status);

    return element ? element.entries.length : 0;
  }

  get droppedAmount(): number {
    const status: AniListListStatus = AniListListStatus.DROPPED;
    const element = this.aniListData.lists.find((list) => list.status === status);

    return element ? element.entries.length : 0;
  }

  get planningAmount(): number {
    const status: AniListListStatus = AniListListStatus.PLANNING;
    const element = this.aniListData.lists.find((list) => list.status === status);

    return element ? element.entries.length : 0;
  }
}
</script>
