<template>
  <v-row>
    <v-col cols="12" md="4">
      {{ $t('pages.search.adultContent.label') }}
      <v-divider />
      <v-radio-group v-model="localAdultContent" :mandatory="true">
        <v-radio :label="$t('pages.search.adultContent.both')" value="both" />
        <v-radio :label="$t('pages.search.adultContent.onlyNonAdult')" value="noAdult" />
        <v-radio :label="$t('pages.search.adultContent.onlyAdult')" value="adult" />
      </v-radio-group>
    </v-col>

    <v-col cols="12" md="4">
      {{ $t('pages.search.inList.label') }}
      <v-divider />

      <v-checkbox
        v-for="status in listStatus"
        :key="status.value"
        v-model="localListValues"
        :label="status.text"
        :value="status.value"
        hide-details
      />
    </v-col>

    <v-col cols="12" md="4">
      {{ $t('pages.search.genres.label') }}
      <v-divider />

      <v-combobox
        v-model="localGenreValues"
        :items="genres"
        clearable
        :search-input.sync="genreSearch"
        hide-selected
        placeholder="..."
        :hint="$t('pages.search.genres.hint')"
        multiple
        persistent-hint
        small-chips
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-content>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <v-list-item-title v-html="$t('pages.search.genres.noMatch', [genreSearch])" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-combobox>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AniListListStatus } from '@/modules/AniList/types';

@Component
export default class SearchFilter extends Vue {
  private listStatus = [
    {
      text: this.$root.$t('misc.aniList.listStatusses.watching'),
      value: AniListListStatus.CURRENT,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.completed'),
      value: AniListListStatus.COMPLETED,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.dropped'),
      value: AniListListStatus.DROPPED,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.paused'),
      value: AniListListStatus.PAUSED,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.planning'),
      value: AniListListStatus.PLANNING,
    },
    {
      text: this.$root.$t('misc.aniList.listStatusses.repeating'),
      value: AniListListStatus.REPEATING,
    },
  ];

  private genres = ['Action', 'Mystery'];

  @Prop()
  private listValues!: AniListListStatus[];

  @Prop(Array)
  private genreValues!: string[];

  @Prop(String)
  private adultContentValue!: string;

  private genreSearch = null;

  private get localGenreValues(): string[] {
    return this.genreValues;
  }

  private set localGenreValues(value: string[]) {
    if (value.length > 3) {
      this.$nextTick(() => this.localGenreValues.pop());
    }

    this.$emit('genreValuesChanged', value);
  }

  private get localListValues(): AniListListStatus[] {
    return this.listValues;
  }

  private set localListValues(value: AniListListStatus[]) {
    this.$emit('listValuesChanged', value);
  }

  private get localAdultContent(): string {
    return this.adultContentValue;
  }

  private set localAdultContent(value: string) {
    this.$emit('adultContentValueChanged', value);
  }
}
</script>
