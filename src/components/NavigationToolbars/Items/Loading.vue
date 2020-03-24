<template>
  <v-btn v-if="isLoading" text small icon>
    <v-progress-circular size="16" width="2" indeterminate />
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['app/isLoading']),
  },
})
export default class Loading extends Vue {
  readonly isLoading: boolean = false;
}
</script>
