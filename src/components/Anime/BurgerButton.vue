<template>
  <v-speed-dial v-model="fab" bottom right open-on-hover fixed>
    <template #activator>
      <v-btn v-model="fab" color="info" dark fab>
        <v-icon v-text="buttonIcon" />
      </v-btn>
    </template>

    <v-tooltip left>
      <template #activator="{ on }">
        <v-btn fab dark small color="green" @click="onSortClick" v-on="on">
          <v-icon>mdi-sort</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('actions.sort') }}</span>
    </v-tooltip>

    <!-- <v-tooltip left>
      <template #activator="{ on }">
        <v-btn fab dark small color="red" @click="onFilterClick" v-on="on">
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </template>
      <span>{{ $t('actions.filter') }}</span>
    </v-tooltip> -->
  </v-speed-dial>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator';

@Component
export default class AnimeBurgerButton extends Vue {
  fab: boolean = false;

  get buttonIcon() {
    return !this.fab ? 'mdi-menu' : 'mdi-close';
  }

  @Emit()
  onSortClick(event: MouseEvent) {
    return [event.clientX, event.clientY];
  }

  // TODO: To be implemented
  // @Emit()
  // onFilterClick() {}
}
</script>
