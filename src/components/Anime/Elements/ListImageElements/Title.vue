<template>
  <span
    class="text-h6 clamp-title force-ltr"
    :class="{
      'clamp-title-single': Number(!!missingEpisodes) ^ Number(!!nextEpisode),
      'clamp-title-double': missingEpisodes && nextEpisode,
      'text-right': $vuetify.rtl,
    }"
  >
    {{ name }}
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ListImageElementsTitle extends Vue {
  @Prop(String) name!: string;
  @Prop(Number) missingEpisodes!: number;
  @Prop(String) nextEpisode!: string | null;
}
</script>
