<template>
  <div>
    <v-dialog v-model="showDialog" max-width="400" persistent>
      <template #activator="{ on }">
        <v-chip v-on="on" small :color="scoreColor">
          <v-icon x-small left>mdi-star</v-icon>
          {{ score }}
        </v-chip>
      </template>

      <v-card>
        <v-card-title>
          {{ $t('pages.aniList.list.scoreDialog.title') }}
        </v-card-title>
        <v-card-subtitle>{{ title }}</v-card-subtitle>
        <v-card-text>
          <v-row justify="center" v-if="isThreePointFormat">
            <v-col
              v-for="btn in threePointButtons"
              :key="`${btn.key}_${btn.value}`"
              cols
              align-self="center"
              class="text-center"
            >
              <v-btn icon :color="btn.color">
                <v-icon v-text="btn.icon" />
              </v-btn>
            </v-col>
          </v-row>

          <v-container fluid class="text-center">
            <v-rating
              v-if="isFivePointFormat || isTenPointFormat"
              v-model="rating"
              hover
              :length="isTenPointFormat ? 10 : 5"
            />

            <v-slider
              v-model="rating"
              min="0"
              :max="isTenDecimalPointFormat ? 10 : 100"
              thumb-label="always"
              :step="isTenDecimalPointFormat ? 0.1 : 1"
              :thumb-color="ratingColor"
              :track-color="ratingColor"
              :color="ratingColor"
            />
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn color="secondary" @click="showDialog = false">
            {{ $t('actions.back') }}
          </v-btn>

          <v-spacer />

          <v-btn color="success" @click="onSaveClick">
            {{ $t('actions.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import { Getter } from '@/decorators';
import { AniListScoreFormat } from '@/types';

@Component
export default class AnimeElementsScoreChip extends Vue {
  @Prop(Number) score!: number;
  @Prop(String) title!: string;
  @Getter('userSettings') scoreFormat!: AniListScoreFormat;
  showDialog: boolean = false;
  rating: number = 0;

  created() {
    this.rating = this.score;
  }

  get scoreColor(): string {
    const score = this.score;
    if (!score) {
      return 'error darken-2';
    }
    const userScoringSystem = this.scoreFormat;
    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 100 < 1 / 3 ? 'error darken-2' : score / 100 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 10 < 1 / 3 ? 'error darken-2' : score / 10 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_5:
        return score / 5 < 1 / 3 ? 'error darken-2' : score / 5 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_3:
        return score <= 1 ? 'error darken-2' : score === 2 ? 'warning darken-2' : 'success darken-2';
      default:
        return 'white';
    }
  }

  get ratingColor(): string {
    const score = this.rating;
    if (!score) {
      return 'error darken-2';
    }
    const userScoringSystem = this.scoreFormat;
    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 100 < 1 / 3 ? 'error darken-2' : score / 100 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 10 < 1 / 3 ? 'error darken-2' : score / 10 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_5:
        return score / 5 < 1 / 3 ? 'error darken-2' : score / 5 < 2 / 3 ? 'warning darken-2' : 'success darken-2';
      case AniListScoreFormat.POINT_3:
        return score <= 1 ? 'error darken-2' : score === 2 ? 'warning darken-2' : 'success darken-2';
      default:
        return 'white';
    }
  }

  get isHundredPointFormat(): boolean {
    return this.scoreFormat === AniListScoreFormat.POINT_100;
  }

  get isTenDecimalPointFormat(): boolean {
    return this.scoreFormat === AniListScoreFormat.POINT_10_DECIMAL;
  }

  get isTenPointFormat(): boolean {
    return this.scoreFormat === AniListScoreFormat.POINT_10;
  }

  get isFivePointFormat(): boolean {
    return this.scoreFormat === AniListScoreFormat.POINT_5;
  }

  get isThreePointFormat(): boolean {
    return this.scoreFormat === AniListScoreFormat.POINT_3;
  }

  get threePointButtons() {
    return [
      {
        key: 'three_point',
        icon: 'mdi-emoticon-sad-outline',
        color: 'error',
        value: 1,
      },
      {
        key: 'three_point',
        icon: 'mdi-emoticon-neutral-outline',
        color: 'warning',
        value: 2,
      },
      {
        key: 'three_point',
        icon: 'mdi-emoticon-happy-outline',
        color: 'success',
        value: 3,
      },
    ];
  }

  @Emit()
  onSaveClick() {
    this.showDialog = false;

    return this.rating;
  }

  @Watch('score')
  onScoreChange(score: number) {
    this.rating = score;
  }
}
</script>
