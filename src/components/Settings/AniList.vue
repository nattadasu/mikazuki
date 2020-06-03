<template>
  <v-container fluid class="py-0">
    <h1 class="headline">{{ $t('menus.settings.aniList') }}</h1>

    <div class="py-1" v-if="!isAuthenticated">
      <v-btn block color="primary" @click="() => {}" v-text="$t('actions.login')" />
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

@Component({
  computed: {
    ...mapGetters('userSettings', ['isAuthenticated']),
  },
})
export default class AniList extends Vue {
  readonly isAuthenticated!: boolean;
}
</script>
