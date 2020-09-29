<template>
  <span class="text-body-2 teal--text text--lighten-3">
    {{ $tc('pages.aniList.list.missingEpisodes', missingEpisodes, [missingEpisodes]) }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ListImageElementsMissingEpisodes extends Vue {
  @Prop(Number) missingEpisodes!: number;
}
</script>
