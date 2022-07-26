<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <pre class="markdown-view"><p v-html="innerHtml" /></pre>
</template>

<script lang="ts" setup>
  import { highlight, languages, hooks } from 'prismjs'
  import { computed } from 'vue'
  import { definition as markdownDefinition, wrapHook, afterTokenizeHook } from '@/utilities/languageDefinitions/markdown'
  import { definition as markupDefinition } from '@/utilities/languageDefinitions/markup'

  languages.markup = markupDefinition
  languages.markdown = languages.extend('markup', {})
  languages.insertBefore('markdown', 'prolog', markdownDefinition)
  languages.md = languages.markdown

  hooks.add('wrap', wrapHook)
  hooks.add('wrap', afterTokenizeHook)

  const props = defineProps<{
    value?: string,
  }>()

  const innerHtml = computed(() => {
    return highlight(props.value ?? '', languages.markdown, 'markdown')
  })
</script>

<style>
.markdown-view {
  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;

  @apply
  whitespace-pre
  break-normal
  font-sans
  rounded
  text-left
  p-4
}

.markdown-view .token.comment,
.markdown-view .token.block-comment,
.markdown-view .token.prolog,
.markdown-view .token.doctype,
.markdown-view .token.cdata {
  @apply
  text-slate-700
}

.markdown-view .token.punctuation {
  @apply
  text-slate-700
}

.markdown-view .token.tag,
.markdown-view .token.attr-name,
.markdown-view .token.namespace,
.markdown-view .token.deleted {
  @apply
  text-rose-500
}

.markdown-view .token.function-name {
  @apply
  text-blue-500
}

.markdown-view .token.boolean,
.markdown-view .token.number,
.markdown-view .token.function {
  @apply
  text-orange-500
}

.markdown-view .token.property,
.markdown-view .token.class-name,
.markdown-view .token.constant,
.markdown-view .token.symbol {
  @apply
  text-yellow-500
}

.markdown-view .token.selector,
.markdown-view .token.important,
.markdown-view .token.atrule,
.markdown-view .token.keyword,
.markdown-view .token.builtin {
  @apply
  text-rose-500
}

.markdown-view .token.string,
.markdown-view .token.char,
.markdown-view .token.attr-value,
.markdown-view .token.regex,
.markdown-view .token.variable {
  @apply
  text-emerald-500
}

.markdown-view .token.operator,
.markdown-view .token.entity,
.markdown-view .token.url {
  @apply
  text-blue-500
}

.markdown-view .token.important,
.markdown-view .token.bold {
  @apply
  font-medium
}

.markdown-view .token.italic {
  /* Can't use the apply style here due to circular imports */
  font-style: italic;
}

.markdown-view .token.entity {
  @apply
  cursor-help
}

.markdown-view .token.inserted {
  @apply
  text-emerald-600
}
</style>