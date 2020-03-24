<template>
  <v-toolbar-items>
    <v-btn text>
      {{ currentMediaTitle }}
    </v-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters(['aniList/currentMediaTitle']),
  },
})
export default class MediaToolbar extends Vue {
  readonly currentMediaTitle!: string;
}
</script>
