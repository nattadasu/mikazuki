<template>
  <v-switch
    v-model="showContent"
    :loading="loading"
    :label="$t('pages.settings.aniList.userAccountSettings.showExplicitContent')"
    :hint="$t('pages.settings.aniList.userAccountSettings.showExplicitContentHint')"
    persistent-hint
    dense
    class="mt-0 pt-0"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ShowExplicitContent extends Vue {
  @Prop(Boolean) show!: boolean;
  loading: boolean = false;

  get showContent(): boolean {
    return this.show;
  }

  set showContent(value: boolean) {
    this.loading = true;
    this.$http
      .updateShowExplicitContent(value)
      .then((show) => this.$store.dispatch('userSettings/setShowExplicitContent', show))
      .finally(() => (this.loading = false));
  }
}
</script>
