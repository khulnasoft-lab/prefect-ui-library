<template>
  <div class="work-pools">
    <div class="work-pools__filters">
      <ResultsCount label="Work pool" :count="total" class="work-pools__results" />

      <SearchInput v-model="search" class="work-pools__search" placeholder="Search work pools" />
    </div>

    <div class="work-pools__list">
      <WorkPoolList :work-pools="workPools" @update="refresh" />
    </div>

    <p-pager v-model:page="page" :pages="pages" />
  </div>
</template>

<script lang="ts" setup>
  import { useDebouncedRef } from '@prefecthq/vue-compositions'
  import { ref } from 'vue'
  import { ResultsCount, SearchInput, WorkPoolList } from '@/components'
  import { useWorkPools, useWorkPoolsFilterFromRoute } from '@/compositions'

  const emit = defineEmits<{
    (event: 'update'): void,
  }>()

  const search = ref('')
  const searchDebounced = useDebouncedRef(search, 1200)
  const { filter } = useWorkPoolsFilterFromRoute({
    workPools: {
      // nameLike: searchDebounced
    },
  })
  const { workPools, subscriptions, total, page, pages } = useWorkPools({}, {
    interval: 30000,
  })

  function refresh(): void {
    subscriptions.refresh()
    emit('update')
  }
</script>

<style>
.work-pools { @apply
  grid
  gap-4
}

.work-pools__filters { @apply
  grid
  md:flex
  gap-2
  justify-between
  items-center
}
</style>