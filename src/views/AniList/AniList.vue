<template>
  <v-main>
    <List :status="status" />
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import List from '@/components/AniList/List.vue';
import EventBus from '@/eventBus';
import { AniListListStatus } from '@/types';

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

  created() {
    this.status = this.$route.meta.status;
  }
}
</script>
