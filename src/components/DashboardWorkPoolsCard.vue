<template>
  <p-card class="dashboard-work-pools-card">
    <p-heading heading="5" class="dashboard-work-pools-card__heading">
      <span>{{ localization.info.dashboardWorkPoolCardTitle }}</span>
    </p-heading>
    <div class="dashboard-work-pools-card__list">
      <DashboardWorkPoolCard
        v-for="workPool in activeWorkPools"
        :key="workPool.id"
        :work-pool="workPool"
        :filter="filter"
      />
    </div>
    <div v-if="showEmptyMsg" class="dashboard-work-pools-card__empty">
      <p>
        {{ localization.info.dashboardWorkPoolCardEmpty }}
      </p>
      <p-link :to="routes.workPools()">
        {{ localization.info.dashboardWorkPoolCardViewAll }}
      </p-link>
    </div>
  </p-card>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import DashboardWorkPoolCard from '@/components/DashboardWorkPoolCard.vue'
  import { useDashboardSubscriptionOptions, useWorkPools, useWorkspaceRoutes } from '@/compositions'
  import { localization } from '@/localization'
  import { WorkspaceDashboardFilter } from '@/types'

  defineProps<{
    filter: WorkspaceDashboardFilter,
  }>()

  const subscriptionOptions = useDashboardSubscriptionOptions()
  const routes = useWorkspaceRoutes()
  const { workPools, subscriptions } = useWorkPools({}, subscriptionOptions)
  const activeWorkPools = computed(() => workPools.value.filter(workPool => !workPool.isPaused))

  const showEmptyMsg = computed(() => {
    return subscriptions.executed && activeWorkPools.value.length === 0
  })
</script>

<style>
.dashboard-work-pools-card__heading { @apply
  mb-4
}

.dashboard-work-pools-card__list { @apply
  flex
  flex-col
  gap-4
}

.dashboard-work-pools-card__empty { @apply
  text-center
  text-subdued
  text-sm
  my-8
}
</style>