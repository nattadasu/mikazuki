<template>
  <v-layout column fill-height d-flex align-center>
    <v-flex xs12>
      <v-avatar size="128" tile>
        <v-img :src="avatarUrl" :alt="userName">
          <template v-slot:placeholder>
            <v-layout fill-height align-center justify-center ma-0>
              <v-progress-circular indeterminate color="grey lighten-5" />
            </v-layout>
          </template>
        </v-img>
      </v-avatar>
    </v-flex>
    <v-flex xs12>
      <span class="headline shadowed">{{ userName }}</span>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IAniListSession } from '@/types';

@Component({
  computed: {
    ...mapGetters('userSettings', ['session']),
    ...mapGetters('app', ['darkMode']),
  },
})
export default class ProfileImage extends Vue {
  readonly darkMode!: boolean;
  readonly session!: IAniListSession;

  get avatarUrl(): string {
    return this.session.user.avatar.large;
  }

  get userName(): string {
    return this.session.user.name;
  }
}
</script>

<style lang="scss" scoped>
.shadowed {
  color: #fff;
  text-shadow: -1px 1px 2px #000, 1px 1px 2px #000, 1px -1px 0 #000, -1px -1px 0 #000;
}
</style>
