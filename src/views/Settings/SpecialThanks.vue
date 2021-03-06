<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-container fill-height grid-list-xl>
        <v-layout wrap class="px-1 py-2">
          <v-flex xs12 sm12 md6>
            <v-layout class="px-1 py-2" wrap>
              <v-flex xs12 class="display-1">
                {{ $t('pages.settings.specialThanks') }}
              </v-flex>
            </v-layout>

            <v-divider />

            <v-layout class="px-1 py-2" wrap>
              <template v-for="(item, index) in getSpecialThanks">
                <v-flex :key="`thanks-icon-${index}`" xs1>
                  <v-icon>mdi-{{ item.icon }}</v-icon>
                </v-flex>

                <v-flex :key="`thanks-name-${index}`" xs4>
                  {{ item.name }}
                </v-flex>

                <v-flex :key="`thanks-message-${index}`" xs7>
                  {{ item.message[currentLanguage] || item.message.en }}
                </v-flex>
              </template>
            </v-layout>
          </v-flex>

          <v-flex xs12 sm12 md6>
            <v-layout class="px-1 py-2" wrap>
              <v-flex xs12 class="display-1">
                {{ $t('pages.settings.supporters') }}
              </v-flex>
            </v-layout>

            <v-divider />

            <v-layout class="px-1 py-2" wrap>
              <template v-for="(item, index) in getSupporters">
                <v-flex :key="`support-icon-${index}`" xs1>
                  <v-icon>mdi-{{ item.icon }}</v-icon>
                </v-flex>

                <v-flex :key="`support-name-${index}`" xs4>
                  {{ item.name }}
                </v-flex>

                <v-flex :key="`support-message-${index}`" xs7>
                  {{ item.message[currentLanguage] || item.message.en }}
                </v-flex>
              </template>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>

      <v-card-actions>
        <v-layout justify-end>
          <v-flex xs6>
            <v-img
              class="pointer-on-hover"
              height="50"
              contain
              :src="require('@/assets/logos/Ko-fi-Support-Button.png')"
              @click="OpenKofiPage"
            />
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import specialThanks from '@/assets/support/specialThanks.json';
import supporters from '@/assets/support/supporters.json';

@Component
export default class SpecialThanksSettings extends Vue {
  @Prop(String)
  tabKey!: string;

  get currentLanguage(): string {
    return this.$i18n.locale;
  }

  get getSpecialThanks() {
    return specialThanks;
  }

  get getSupporters() {
    return supporters;
  }

  OpenKofiPage(): void {
    window.open('https://ko-fi.com/nicoaiko', '_blank');
  }
}
</script>

<style lang="scss" scoped>
.pointer-on-hover:hover {
  cursor: pointer;
}
</style>
