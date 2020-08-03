<template>
  <v-expansion-panels accordion>
    <v-expansion-panel v-for="(item, idx) in renderedChangelogs" :key="`item_${idx}`">
      <v-expansion-panel-header>Test</v-expansion-panel-header>
      <v-expansion-panel-content v-html="item" />
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownIt from 'markdown-it';
import markdownChangelog from '@/../CHANGELOG.md';

@Component
export default class Changelog extends Vue {
  renderedChangelogs: string[] = [];
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

    this.changelogs = markdownChangelog.split('---');
    this.changelogs.forEach((item) => {
      this.renderedChangelogs.push(md.render(item));
    });
  }
}
</script>

<style lang="scss">
#changelog-wrapper {
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
