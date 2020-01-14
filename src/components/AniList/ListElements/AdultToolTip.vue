<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-icon class="pointerCursor" color="error" v-on="on">
        mdi-alert
      </v-icon>
    </template>
    <span>{{ $t('alerts.adultContent') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class AdultTooltip extends Vue {}
</script>
