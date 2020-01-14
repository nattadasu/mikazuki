<template>
  <v-img
    :src="imageLink"
    height="250px"
    position="50% 35%"
    class="pointerCursor"
    @click.native="moveToDetails(aniListId)"
  >
    <template v-slot:placeholder>
      <v-container class="pa-0 justify-center fill-height align-center">
        <v-progress-circular indeterminate color="grey lighten-5" />
      </v-container>
    </template>
    <v-container v-if="name" class="fluid fill-height d-flex align-end py-0 anime-image-container">
      <v-row :class="`${darkMode ? 'shadowed' : 'lightened'} ${isMobile ? 'titled-mobile' : 'titled'}`">
        <v-col cols="12" class="pb-2">
          <span class="title">{{ name }}</span>
        </v-col>
        <v-spacer v-if="concatenatedStudios.length" />
        <v-col v-if="concatenatedStudios.length" cols="12" align-self="end">
          <span class="grey--text" :class="{ 'text--darken-4': !darkMode }">{{ concatenatedStudios }}</span>
        </v-col>
      </v-row>
    </v-container>
  </v-img>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';
import { IAniListMediaStudio, IAniListMediaStudioNode, ZeroTwoListDataItem } from '../../../types';

@Component
export default class ListImage extends Vue {
  @Prop(Object) item!: ZeroTwoListDataItem;
  @Prop(Boolean) showStudios!: boolean;

  get aniListId(): number {
    return this.item.media.id;
  }

  get name(): string {
    return this.item.media.title.userPreferred;
  }

  get imageLink(): string {
    return this.item.media.coverImage.extraLarge;
  }

  get studios(): IAniListMediaStudio {
    return this.item.media.studios;
  }

  get darkMode(): boolean {
    return this.$vuetify.theme.dark;
  }

  get isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  get concatenatedStudios(): string {
    if (!this.studios || !this.studios.nodes || !this.studios.nodes.length || !this.showStudios) {
      return '';
    }

    let animationStudios = this.studios.nodes
      .filter((item: IAniListMediaStudioNode) => item.isAnimationStudio)
      .map((item: IAniListMediaStudioNode) => item.name);

    if (!animationStudios.length) {
      animationStudios = this.studios.nodes.map((item: IAniListMediaStudioNode) => item.name);
    }

    return animationStudios[0];
  }

  moveToDetails(id: number) {
    const aniListId = id.toString();
    const location: RawLocation = { name: 'DetailView', params: { id: aniListId } };
    this.$router.push(location);
  }
}
</script>

<style lang="scss" scoped>
.pointerCursor {
  cursor: pointer;
}

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
