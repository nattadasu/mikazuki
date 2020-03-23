<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn text icon v-on="{ ...toolTip }" @click="navigateBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('actions.back') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Route, RawLocation } from 'vue-router';

@Component
export default class Back extends Vue {
  lastRoutes: Route[] = [];

  navigateBack(): void {
    if (this.lastRoutes && this.lastRoutes.length) {
      const lastRoute = this.lastRoutes.pop() as RawLocation;
      this.$router.push(lastRoute);

      // Due to hitting back actually uses "push"
      // Our current route is being saved in our storage.
      // We have to get rid of this entry so we get in no loop.
      this.lastRoutes.pop();
    }
  }

  @Watch('$route', { deep: true })
  onRouteUpdate(route: Route, oldRoute: Route) {
    this.lastRoutes.push(oldRoute);
  }
}
</script>
