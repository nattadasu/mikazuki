<template>
  <v-menu v-model="showMenu" absolute offset-x offset-y left top :position-x="x" :position-y="y">
    <v-list>
      <v-list-item
        v-for="(item, index) in sortables"
        :key="`sortmenu_index_${index}`"
        link
        @click="onSortableClick(item.value, item.desc)"
      >
        <v-list-item-title v-text="item.text" />

        <v-list-item-action>
          <v-icon @click="item.desc = !item.desc">mdi-sort-{{ item.desc ? 'descending' : 'ascending' }}</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Emit, Prop, PropSync, Vue } from 'vue-property-decorator';

@Component
export default class SortMenu extends Vue {
  @PropSync('show', Boolean) showMenu!: boolean;
  @Prop(Array) position!: [number, number];

  get x() {
    return this.position[0];
  }

  get y() {
    return this.position[1];
  }

  sortables: any[] = [
    {
      text: 'By Title',
      value: 'title',
      desc: false,
    },
    {
      text: 'By Score',
      value: 'score',
      desc: false,
    },
    {
      text: 'By Episodes',
      value: 'episodeAmount',
      desc: false,
    },
  ];

  @Emit('update:sort')
  onSortableClick(key: string, desc: boolean) {
    this.showMenu = false;

    return [key, desc];
  }
}
</script>
