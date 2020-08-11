<template>
  <v-container fluid class="py-0">
    <h1 class="pb-4">{{ $t('menus.settings.changelog') }}</h1>
    <v-expansion-panels accordion flat>
      <v-expansion-panel v-for="([version, text], idx) in renderedChangelogs" :key="`item_${idx}`">
        <v-expansion-panel-header>{{ version }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="changelog-wrapper" v-html="text" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownIt from 'markdown-it';
import markdownChangelog from '@/../CHANGELOG.md';

@Component
export default class Changelog extends Vue {
  renderedChangelogs: [string, string][] = [];
  changelogs: string[] = [];

  created() {
    const md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      quotes: '„“‚‘',
    });

    const defaultRender =
      md.renderer.rules.link_open ||
      function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
      const aIndex = tokens[idx].attrIndex('target');

      if (aIndex < 0) {
        tokens[idx].attrPush(['target', '_blank']);
      } else {
        (tokens[idx].attrs as any)[aIndex][1] = '_blank';
      }

      return defaultRender(tokens, idx, options, env, self);
    };

    const changelogMap = new Map<string, string>();
    this.changelogs = markdownChangelog.split('---');
    this.changelogs.forEach((item) => {
      const matches = item.trim().match(/^##\s(v\d\.\d\.\d).*/);
      if (!matches?.length) {
        return;
      }

      const [, version] = matches;
      const rendered = md.render(item.trim());

      changelogMap.set(version, rendered);
    });

    this.renderedChangelogs = Array.from(changelogMap.entries());
  }
}
</script>

<style lang="scss">
.changelog-wrapper {
  padding: 8px;

  h2 {
    margin: 4px 0;
    margin-top: 12px;
  }

  h3 {
    margin: 4px 0;
  }

  hr {
    margin: 20px 0;
  }

  details {
    summary {
      &:focus {
        outline: none;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
