<template>
  <v-menu
    v-model="showMenu"
    absolute
    offset-x
    offset-y
    :left="!$vuetify.rtl"
    :right="$vuetify.rtl"
    top
    :position-x="x"
    :position-y="y"
  >
    <v-list>
      <v-list-item
        v-for="(item, index) in sortables"
        :key="`sortmenu_index_${index}`"
        link
        @click="onSortableClick(item.value, item.desc)"
      >
        <v-list-item-title v-text="$t(`misc.sorting.by.${item.text}`)" />

        <v-list-item-action>
          <v-tooltip left>
            <template #activator="{ on }">
              <v-icon @click.stop.prevent="onUpdateSortingDirectionClick(item)" v-on="on">
                mdi-sort-{{ item.desc ? 'descending' : 'ascending' }}
              </v-icon>
            </template>
            <span>{{ $t(`misc.sorting.direction.${item.desc ? 'desc' : 'asc'}`) }}</span>
          </v-tooltip>
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
      text: 'title',
      value: 'title',
      desc: false,
    },
    {
      text: 'score',
      value: 'score',
      desc: false,
    },
    {
      text: 'episodes',
      value: 'episodeAmount',
      desc: false,
    },
  ];

  @Emit('update:sort')
  onSortableClick(key: string, desc: boolean) {
    this.showMenu = false;

    return [key, desc];
  }

  @Emit('update:sort')
  onUpdateSortingDirectionClick(item: any) {
    item.desc = !item.desc;

    return [item.value, item.desc];
  }
}
</script>
