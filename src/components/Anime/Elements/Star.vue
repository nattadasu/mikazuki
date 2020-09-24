<template>
  <div style="position: relative; width: 28px; height: 28px; display: inline-block; text-align: center">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 1000 1000"
      enable-background="new 0 0 1000 1000"
      xml:space="preserve"
      :style="styles"
    >
      <g>
        <path
          :fill="_color"
          d="M963,473.8c24.3-23.7,33-58.6,22.8-91.1c-10.4-33-38-56.6-72-61.5l-204.4-29.8c-16.7-2.4-31-12.8-38.4-27.9L579.6,78C564.5,47.4,534,28.4,500,28.4c-34,0-64.5,19-79.6,49.7L329,263.6c-7.4,15.1-21.8,25.5-38.4,27.9L86.2,321.2c-34,5-61.6,28.5-72,61.5C4,415.2,12.7,450.1,37,473.8l147.9,144.4c11.9,11.6,17.4,28.4,14.5,44.7l-34.9,204c-4.5,26.1,2.2,51.7,18.8,71.9c26.2,31.8,73.1,41.8,109.9,22.4L476.1,865c14.7-7.8,33.1-7.8,47.8,0l182.8,96.3c13.1,6.9,26.9,10.4,41.2,10.4c26.1,0,51.8-12.3,68.7-32.8c16.6-20.2,23.3-45.7,18.8-71.9l-34.9-204c-2.8-16.4,2.6-33.1,14.6-44.7L963,473.8z M763.3,669.6l34.9,204c2.5,14.7-1.2,29.1-10.5,40.4c-15.1,18.4-42.1,24.5-63.7,13l-182.8-96.3c-12.7-6.7-26.9-10.2-41.2-10.2c-14.3,0-28.6,3.5-41.2,10.2L276,926.9c-21.6,11.4-48.5,5.4-63.6-13c-9.3-11.3-13.1-25.6-10.5-40.4l34.9-204c5-29.1-4.6-58.8-25.7-79.3L63.2,445.9c-14-13.6-18.8-32.8-13-51.4c6-19.1,21.4-32.2,41.3-35.1l204.4-29.8c28.9-4.2,53.9-22.4,66.9-48.8l91.4-185.5C462.9,77.6,480.1,67,500,67c19.9,0,37.1,10.6,45.8,28.4L637.3,281c13,26.3,38,44.6,66.9,48.8l204.4,29.8c19.9,2.9,35.3,16,41.3,35.1c5.8,18.5,1,37.7-13,51.4L788.9,590.4C767.9,610.9,758.3,640.6,763.3,669.6z"
        />
      </g>
    </svg>

    <div style="position: absolute; top: 11px; left: 0; font-size: 10px; text-align: center; width: 32px; height: 32px">
      <slot>?</slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AnimeElementsStar extends Vue {
  @Prop(String) color!: string;

  get _color(): string {
    if (!this.color) {
      return this.$vuetify.theme.dark ? 'white' : 'black';
    }

    return this.color;
  }

  get styles() {
    return {
      width: this._width,
      height: this._height,
    };
  }

  get _width(): string {
    return '32px';
  }

  get _height(): string {
    return '32px';
  }
}
</script>
