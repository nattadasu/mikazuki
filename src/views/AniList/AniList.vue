<template>
  <v-content>
    <List :last-route="lastRoute" :status="status" />
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import List from '@/components/AniList/List.vue';
import EventBus from '@/eventBus';
import { AniListListStatus } from '@/types';
import { Route } from 'vue-router';

@Component({
  components: {
    List,
  },
  beforeRouteEnter(to, from, next) {
    console.log('called');
    next((vm: any) => {
      vm.lastRoute = from;
    });
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
