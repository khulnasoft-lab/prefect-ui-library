<template>
  <p-content class="work-pools">
    <div class="work-pools__filters">
      <ResultsCount label="Work pool" :count="total" class="work-pools__results" />

      <SearchInput v-model="search" class="work-pools__search" placeholder="Search work pools" />
    </div>

    <WorkPoolList :work-pools="workPools" @update="refresh" />

    <template v-if="pages > 1">
      <p-pager v-model:page="page" :pages="pages" />
    </template>
  </p-content>
</template>

<script lang="ts" setup>
  import { NumberRouteParam, useDebouncedRef, useRouteQueryParam } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { ResultsCount, SearchInput, WorkPoolList } from '@/components'
  import { useWorkPools, useWorkPoolsFilterFromRoute } from '@/compositions'

  const emit = defineEmits<{
    (event: 'update'): void,
  }>()

  const search = ref('')
  const page = useRouteQueryParam('page', NumberRouteParam, 1)
  const searchDebounced = useDebouncedRef(search, 1200)
  const { filter } = useWorkPoolsFilterFromRoute({
    workPools: {
    },
  })
  const { workPools, subscriptions, total, pages } = useWorkPools({}, {
    interval: 30000,
    page,
  })

  function refresh(): void {
    subscriptions.refresh()
    emit('update')
  }
</script>

<style>
.work-pools__filters { @apply
  grid
  md:flex
  gap-2
  justify-between
  items-center
}
</style>