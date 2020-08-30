<template>
  <v-container fluid class="py-0">
    <h1 class="pb-1">{{ $t('pages.settings.specialThanks.translators') }}</h1>

    <v-row>
      <v-col cols="12" md="6" class="py-1" v-for="(item, index) in translators" :key="`translator_${index}`">
        <h4 class="py-1">
          <v-icon
            v-for="(icon, i) in item.icons"
            :key="`translator_${index}_icon_${i}`"
            left
            :class="`flag-icon flag-icon-${icon}`"
          />
          <span class="title">{{ item.name }}</span>
        </h4>
        <div class="body-2">{{ item.message }}</div>
      </v-col>
    </v-row>

    <h1 class="pt-8 pb-1">{{ $t('pages.settings.specialThanks.supporters') }}</h1>

    <v-row>
      <v-col cols="12" md="6" class="pa-2" v-for="(item, index) in supporters" :key="`supporter_${index}`">
        <h4 class="py-1">
          <v-icon left v-text="`mdi-${item.icon}`" />
          <span class="title">{{ item.name }}</span>
        </h4>
        <div class="body-2">{{ item.message }}</div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="auto">
        <image-link :link="kofiLink" :image="kofiButton" image-text="Ko-fi" :max-height="75" contain />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SupportList from '@/assets/support/support.json';
import ImageLink from './About/ImageLink.vue';
import KofiSupportButton from '@/assets/logos/Ko-fi-Support-Button.png';

@Component({ components: { ImageLink } })
export default class SpecialThanks extends Vue {
  readonly kofiButton = KofiSupportButton;
  readonly kofiLink = 'https://ko-fi.com/nicoaiko';

  get supporters() {
    return SupportList?.support ?? [];
  }

  get translators() {
    return SupportList?.translators ?? [];
  }
}
</script>

<style lang="scss" scoped>
.pointer-on-hover:hover {
  cursor: pointer;
}
</style>
