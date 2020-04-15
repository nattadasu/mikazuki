<template>
  <v-btn v-if="isLoading" text small icon>
    <v-progress-circular :size="size || 16" width="2" indeterminate />
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('app', ['isLoading']),
  },
})
export default class Loading extends Vue {
  @Prop([Number, String]) size!: number | string;
  readonly isLoading!: boolean;
}
</script>
