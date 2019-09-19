<template>
  <v-content>
    <v-row>
      <v-col cols="12">
        <List :status="status" />
      </v-col>
    </v-row>
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import List from '@/components/AniList/List.vue';
import EventBus from '@/eventBus';
import { AniListListStatus } from '@/modules/AniList/types';

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
  private status!: AniListListStatus;

  private created() {
    this.status = this.$route.meta.status;
  }
}
</script>
