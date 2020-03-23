<template>
  <v-dialog width="650">
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
        <v-icon color="error">mdi-alert</v-icon>
      </v-btn>
    </template>

    <v-card class="direction-ltr">
      <v-card-title>
        <v-icon large left color="error">mdi-alert</v-icon>
        {{ $t('transfer.title') }}
      </v-card-title>

      <v-card-text>
        <p v-for="(item, index) in transferText" :key="`text_${index}`">
          {{ item }}
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TransferMessageBox extends Vue {
  dialog: boolean = false;

  get transferText() {
    return (this.$t('transfer.text') as string).split('\n');
  }
}
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
}
</style>
