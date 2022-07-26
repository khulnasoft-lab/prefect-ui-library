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

  const markdownRef = ref('')
</script>

<style>
.markdown-editor-section__input {
  min-height: 300px;
  resize: none;
}
</style>