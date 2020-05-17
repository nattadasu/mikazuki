<template>
  <v-container fluid v-if="title" class="fill-height d-flex align-end py-0 anime-image-container">
    <v-row
      :class="
        `${darkMode ? 'shadowed' : 'lightened'} ${isMobile || forceDisableAnimation ? 'titled-mobile' : 'titled'}`
      "
    >
      <v-col cols="12" class="pb-2">
        <span class="title">{{ title }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import RegularFunctionsMixin from '@/mixins/regular';

@Component
export default class NameContainer extends Mixins(RegularFunctionsMixin) {
  @Prop(String) title!: string;
  @Prop(Boolean) forceDisableAnimation!: boolean;
}
</script>

<style lang="scss" scoped>
.anime-image-container {
  & .titled {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }
    position: absolute;
    bottom: 0;
    width: 100%;
    max-height: 52px;
    transition: 0.25s ease-in-out;
  }
  & .titled-mobile {
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.65);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.85);
    }
    position: absolute;
    bottom: 0;
    width: 100%;
    transition: 0.25s ease-in-out;
  }
  &:hover > .titled {
    max-height: 75%;
    &.shadowed {
      background-color: rgba(0, 0, 0, 0.85);
    }
    &.lightened {
      background-color: rgba(255, 255, 255, 0.95);
    }
  }
}
</style>
