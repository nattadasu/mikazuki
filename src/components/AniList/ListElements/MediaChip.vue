<template>
  <v-hover v-slot:default="{ hover }">
    <v-chip small :ripple="false" link :color="mediaStatusChipColor">
      <v-expand-x-transition>
        <span v-if="hover || isMobile || forceDisableAnimation">
          {{ $t(`misc.aniList.mediaStatus.${status.toString().toLowerCase()}`) }}
        </span>
      </v-expand-x-transition>

      <v-icon small :right="hover || isMobile || forceDisableAnimation">{{ mediaStatusIcon }}</v-icon>
    </v-chip>
  </v-hover>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator';
import RegularFunctionsMixin from '@/mixins/regular';
import { AniListMediaStatus } from '@/types';

@Component
export default class MediaChip extends Mixins(RegularFunctionsMixin) {
  @Prop(String) status!: string;
  @Prop(Boolean) forceDisableAnimation!: boolean;

  get mediaStatusIcon(): string {
    return this.status === AniListMediaStatus.CANCELLED
      ? 'mdi-cancel'
      : this.status === AniListMediaStatus.NOT_YET_RELEASED
      ? 'mdi-calendar'
      : this.status === AniListMediaStatus.RELEASING
      ? 'mdi-antenna'
      : 'mdi-stop';
  }
  get mediaStatusChipColor(): string {
    return this.status === AniListMediaStatus.CANCELLED
      ? 'red darken-2'
      : this.status === AniListMediaStatus.NOT_YET_RELEASED
      ? 'yellow darken-4'
      : this.status === AniListMediaStatus.RELEASING
      ? 'success darken-2'
      : 'info darken-2';
  }
}
</script>
