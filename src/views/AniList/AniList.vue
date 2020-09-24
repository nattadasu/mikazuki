<template>
  <v-main>
    <list :status="status" />
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import List from '@/components/Anime/List.vue';

// Custom Components
// import List from '@/components/AniList/List.vue';
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
