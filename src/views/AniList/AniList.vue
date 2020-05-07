<template>
  <v-content>
    <v-progress-linear absolute v-if="isLoading" indeterminate />
    <List :status="status" />
  </v-content>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import List from '@/components/AniList/List.vue';
import EventBus from '@/eventBus';
import { AniListListStatus } from '@/types';

@Component({
  components: {
    List,
  },
  computed: {
    ...mapGetters('app', ['isLoading']),
  },
})
export default class AniList extends Vue {
  readonly isLoading!: boolean;
  status!: AniListListStatus;

  created() {
    this.status = this.$route.meta.status;
  }
}
</script>
