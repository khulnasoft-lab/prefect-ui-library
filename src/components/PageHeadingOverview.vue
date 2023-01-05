<template>
  <page-heading class="page-heading-overview" :crumbs="crumbs">
    <template v-if="!hideActions" #actions>
      <p-tags-input v-model="tags" empty-message="All tags" class="overview__tags" />
    </template>
  </page-heading>
</template>

<script lang="ts" setup>
  import PageHeading from '@/components/PageHeading.vue'
  import { useFlowRunFilterFromRoute } from '@/compositions'

  defineProps<{
    hideActions?: boolean,
  }>()


  const { tags } = useFlowRunFilterFromRoute()

  const crumbs = [{ text: 'Overview' }]
</script>

<style>
.overview__tags {
  @apply
  w-48
}
</style>