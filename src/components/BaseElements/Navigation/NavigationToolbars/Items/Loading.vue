<template>
  <v-btn v-if="isLoading" text small icon>
    <v-progress-circular :size="size || 16" width="2" indeterminate />
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

// Custom Components
import { appStore } from '@/store';

@Component
export default class Loading extends Vue {
  @Prop([Number, String]) size!: number | string;
  get isLoading(): boolean {
    return appStore.isLoading;
  }
}
</script>
