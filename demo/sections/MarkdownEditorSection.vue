<template>
  <DemoSection heading="Markdown Editor">
    <p-content>
      <MarkdownInput v-model="markdownRef" class="markdown-editor-section__input" />
    </p-content>
  </DemoSection>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import DemoSection from '../components/DemoSection.vue'
  import MarkdownInput from '@/components/MarkdownInput.vue'

  const markdownRef = ref(`~~Hello~~

> Comment testing

This PR:
- Adds deployment description and deployment description empty state components to the main body of the deployment page
- Adds deployment route and edit page
- Adds the ability to modify schedules + deployments from the UI

This PR is dependent on:
[orion-design#414](https://github.com/PrefectHQ/orion-design/pull/414)
[orion-design#417](https://github.com/PrefectHQ/orion-design/pull/417)
[orion-design#419](https://github.com/PrefectHQ/orion-design/pull/419)
and the \`deployment - prepare\` branch`)
</script>

<style>
.markdown-editor-section__input {
  min-height: 300px;
  resize: none;
}
</style>