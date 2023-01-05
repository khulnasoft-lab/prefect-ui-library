<template>
  <page-heading class="page-heading-overview" :crumbs="crumbs">
    <template v-if="!hideActions" #actions>
      <p-tags-input v-model="tags" empty-message="All tags" class="overview__tags" />
      {{ tags }} {{ uniqueTags }}
    </template>
  </page-heading>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, ComputedRef } from 'vue'
  import PageHeading from '@/components/PageHeading.vue'
  import { useFlowRunFilterFromRoute, useWorkspaceApi } from '@/compositions'
  import { dateFunctions } from '@/utilities/timezone'


  defineProps<{
    hideActions?: boolean,
  }>()

  const crumbs = [{ text: 'Overview' }]

  const { tags } = useFlowRunFilterFromRoute()
  const defaultStartDate = dateFunctions.subDays(dateFunctions.startOfToday(), 2)
  const api = useWorkspaceApi()
  const subscriptionOptions = {
    interval: 30000,
  }


  const recentFlowRunFilter = computed(() => {
    const filter = {
      'flow_runs': {
        'expected_start_time': {
          after_: defaultStartDate,
        },
      },
    }
    return filter
  })


  const recentFlowRunSubscription = useSubscription(api.flowRuns.getFlowRuns, [recentFlowRunFilter], subscriptionOptions)
  const recentRuns = computed(() => {
    return recentFlowRunSubscription.response ?? []
  })
  const recentFlowRunTags: ComputedRef<string[][]> = computed(() => recentRuns.value.map(run => run.tags ?? []))
  const tagList = computed(() => recentFlowRunTags.value.flat())
  const uniqueTags = computed(() => [...new Set(tagList.value)])
</script>

<style>
.overview__tags {
  @apply
  w-48
}
</style>


