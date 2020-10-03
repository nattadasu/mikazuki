<template>
  <span class="text-body-2 teal--text text--lighten-3">
    {{ nextEpisode }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ListImageElementsNextEpisode extends Vue {
  @Prop(String) nextEpisode!: string | null;
}
</script>
