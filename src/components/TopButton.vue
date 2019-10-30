<template>
  <v-btn v-if="isSortingPage" bottom color="info" fab fixed large right @click="jumpToTop">
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Top extends Vue {
  get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  jumpToTop(): void {
    window.scrollTo(0, 0);
  }
}
</script>
