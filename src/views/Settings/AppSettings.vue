<template>
  <v-tab-item :key="tabKey">
    <v-card flat>
      <v-card-text>
        <v-container fill-height grid-list-xl>
          <v-layout wrap>
            <v-flex xs12 sm5>
              <v-select
                :items="languages"
                item-text="original"
                :value="_locale"
                dense
                :label="$t('pages.settings.appSettings.chooseLanguage')"
                @change="_setLanguage"
              >
                <template v-slot:selection="data">{{ data.item.original }} ({{ data.item.english }})</template>
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.original }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.item.english }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>
            </v-flex>

            <v-flex xs12 sm5 offset-sm2 justify-center align-center>
              <v-switch v-model="_darkMode" :label="$t('pages.settings.appSettings.darkMode')" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-tab-item>
</template>

<script lang="ts">
import { map } from 'lodash';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('app', ['darkMode', 'language']),
  },
})
export default class AppSettings extends Vue {
  readonly darkMode!: boolean;
  readonly language!: string;

  _locale: string = '';

  @Prop(String)
  tabKey!: string;

  get languages(): any {
    const { messages } = this.$i18n;
    return map(messages, (value, key) => {
      const locale = key;
      const original = value.originalReading;
      const english = value.englishReading;

      return {
        value: locale,
        original,
        english,
      };
    });
  }

  get _darkMode(): boolean {
    return this.darkMode;
  }

  set _darkMode(state: boolean) {
    this.$store.commit('app/setDarkMode', state);
  }

  /**
   * @method created is being called before mount
   * @protected
   */
  created(): void {
    this._locale = this.language;
  }

  /**
   * @method setLanguage
   * @param {string} newLanguage contains the locale value of the new language
   */
  _setLanguage(newLanguage: string): void {
    this.$store.commit('app/setLanguage', newLanguage);
    this._locale = newLanguage;
  }
}
</script>
