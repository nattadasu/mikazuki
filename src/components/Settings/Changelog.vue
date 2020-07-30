<template>
  <div id="changelog-wrapper" v-html="renderedChangelog" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownItContainer from 'markdown-it-container';
import MarkdownIt from 'markdown-it';
import markdownChangelog from '@/../CHANGELOG.md';

@Component
export default class Changelog extends Vue {
  renderedChangelog: string = '';

  created() {
    const md = new MarkdownIt({
      html: false,
      linkify: true,
      typographer: true,
      quotes: '„“‚‘',
    });
    md.use(MarkdownItContainer, 'spoiler', {
      validate(params: string) {
        return params.trim().match(/^spoiler\s+(.*)$/);
      },
      render(tokens: any, idx: number | string) {
        const m = tokens[idx].info.trim().match(/^spoiler\s+(.*)$/);

        if (tokens[idx].nesting === 1) {
          // opening tag
          return `<details><summary>${md.utils.escapeHtml(m[1])}</summary>\n`;
        } else {
          return '</details>\n';
        }
      },
    });

    this.renderedChangelog = md.render(markdownChangelog);
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
