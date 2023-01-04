<template>
  <page-heading class="page-heading-overview" :crumbs="crumbs">
    <template v-if="!hideActions" #actions>
      <SavedFilters />
    </template>
  </page-heading>
</template>

<script lang="ts" setup>
  import PageHeading from '@/components/PageHeading.vue'
  import SavedFilters from '@/components/SavedFilters.vue'


  defineProps<{
    hideActions?: boolean,
  }>()

  const crumbs = [{ text: 'Overview' }]
</script>