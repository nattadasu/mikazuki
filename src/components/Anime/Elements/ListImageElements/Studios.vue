<template>
  <span class="grey--text" :class="{ 'text--darken-4': !darkMode }">{{ studios }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ListImageElementsStudios extends Vue {
  @Prop(String) studios!: string;

  get darkMode(): boolean {
    return this.$vuetify.theme.dark;
  }
}
</script>
