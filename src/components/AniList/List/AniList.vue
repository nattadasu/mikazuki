<template>
  <v-content>
    <List :last-route="lastRoute" :status="status" />
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import List from './Elements/List.vue';
import EventBus from '@/eventBus';
import { AniListListStatus } from '@/types';
import { Route } from 'vue-router';

@Component({
  components: {
    List,
  },
  beforeRouteUpdate(to, from, next) {
    EventBus.$emit('resetAllSorts');
    next();
  },
  beforeRouteLeave(to, from, next) {
    EventBus.$emit('resetAllSorts');
    next();
  },
})
export default class AniList extends Vue {
  status!: AniListListStatus;
  lastRoute: Route | null = null;

  created() {
    this.status = this.$route.meta.status;
  }
}
</script>
