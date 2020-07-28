<template>
  <a :href="link" target="_blank">
    <v-img :class="{ 'bright-shadow': !!dark }" :src="image" :alt="imageText">
      <template #placeholder>
        <v-row align="center" justify="center" class="ma-0">
          <v-progress-circular indeterminate color="grey lighten-5" />
        </v-row>
      </template>
    </v-img>
  </a>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ImageLink extends Vue {
  @Prop(String) link!: string;
  @Prop(String) image!: string;
  @Prop(String) imageText!: string;
  @Prop(Boolean) dark!: boolean;
}
</script>

<style lang="scss">
.bright-shadow .v-image__image {
  filter: drop-shadow(0px 0px 8px white);
}
</style>
