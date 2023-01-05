<template>
  <p-card class="overview-cards__card">
    <p-content>
      Flows With Recent Runs
      <div v-for="flow, index in recentFlows" :key="index">
        <FlowIconText :flow-id="flow" />
      </div>
    </p-content>
  </p-card>

  <p-card class="overview-cards__card">
    <p-content>
      Flows With Failed Runs
      <div v-for="flow, index in failedFlows" :key="index">
        <FlowIconText :flow-id="flow" />
      </div>
    </p-content>
  </p-card>

  <p-card class="overview-cards__card">
    <p-content>
      Deployments With Failed Runs
      <div v-for="deployment, index in failedDeployments" :key="index">
        <DeploymentIconText v-if="deployment" :deployment-id="deployment" />
      </div>
    </p-content>
  </p-card>

  <p-card class="overview-cards__card">
    <p-content>
      Work Queues With Failed Runs
      <div v-for="queue, index in failedWorkQueues" :key="index">
        <WorkQueueIconText v-if="queue" :work-queue-name="queue" />
      </div>
    </p-content>
  </p-card>

  <p-card class="overview-cards__card">
    <p-content>
      Work Queues With Late Runs
      <div v-for="queue, index in lateWorkQueues" :key="index">
        <WorkQueueIconText v-if="queue" :work-queue-name="queue" />
      </div>
    </p-content>
  </p-card>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed, watch, Ref } from 'vue'
  import { WorkQueueIconText } from '.'
  import DeploymentIconText from '@/components/DeploymentIconText.vue'
  import FlowIconText from '@/components/FlowIconText.vue'
  import { useWorkspaceApi, useFlowRunFilterFromRoute } from '@/compositions'
  import { FlowFilter } from '@/types'
  import { dateFunctions } from '@/utilities/timezone'


  const api = useWorkspaceApi()
  const subscriptionOptions = {
    interval: 30000,
  }

  // const flowFilter = useFlowFilterFromRoute().filter
  const defaultStartDate = dateFunctions.subDays(dateFunctions.startOfToday(), 2)

  // const updatedFlowFilter: FlowFilter = {
  //   ...flowFilter.value,
  //   'flow_runs': {
  //     state: {
  //       type: {
  //         any_: ['FAILED'],
  //       },
  //     },
  //     'expected_start_time': {
  //       after_: defaultStartDate,
  //     },
  //   },
  // }

  // const flowsSubscription = useSubscription(api.flows.getFlows, [updatedFlowFilter], subscriptionOptions)
  // const failedFlows = computed(() => flowsSubscription.response ?? [])

  // const workerFilter = {}
  // const workQueueSubscription = useSubscription(api.workQueues.getWorkQueues, [workerFilter], subscriptionOptions)
  // const workers = computed(() => workQueueSubscription.response ?? [])

  const { tags } = useFlowRunFilterFromRoute()

  const recentFlowRunFilter = computed(() => {
    const filter = {
      'flow_runs': {
        'tags': {
          all_: tags.value,
        },
        'expected_start_time': {
          after_: defaultStartDate,
        },
      },
    }
    return filter
  })

  const failedFlowRunFilter = computed(() => {
    const filter = {
      'flow_runs': {
        state: {
          type: {
            any_: ['FAILED'],
          },
        },
        'tags': {
          all_: tags.value,
        },
        'expected_start_time': {
          after_: defaultStartDate,
        },
      },
    }
    return filter
  })

  const lateFlowRunFilter = computed(() => {
    const filter = {
      'flow_runs': {
        state: {
          name: {
            any_: ['Late'],
          },
        },
        'tags': {
          all_: tags.value,
        },
        'expected_start_time': {
          after_: defaultStartDate,
        },
      },
    }
    return filter
  })

  const failedFlowRunSubscription = useSubscription(api.flowRuns.getFlowRuns, [failedFlowRunFilter], subscriptionOptions)
  const failedRuns = computed(() => {
    return failedFlowRunSubscription.response ?? []
  })
  const failedWorkQueueRuns = computed(() => failedRuns.value.map(run => run.workQueueName))
  const failedWorkQueues = computed(() => [...new Set(failedWorkQueueRuns.value)])
  const failedDeploymentRuns = computed(() => failedRuns.value.map(run => run.deploymentId))
  const failedDeployments = computed(() => [...new Set(failedDeploymentRuns.value)])
  const failedFlowRuns = computed(() => failedRuns.value.map(run => run.flowId))
  const failedFlows = computed(() => [...new Set(failedFlowRuns.value)])
  const lateFlowRunsSubscription = useSubscription(api.flowRuns.getFlowRuns, [lateFlowRunFilter], subscriptionOptions)
  const lateRuns = computed(() => {
    return lateFlowRunsSubscription.response ?? []
  })
  const lateWorkQueueRuns = computed(() => lateRuns.value.map(run => run.workQueueName))
  const lateWorkQueues = computed(() => [...new Set(lateWorkQueueRuns.value)])
  const recentFlowRunSubscription = useSubscription(api.flowRuns.getFlowRuns, [recentFlowRunFilter], subscriptionOptions)
  const recentRuns = computed(() => {
    return recentFlowRunSubscription.response ?? []
  })
  const recentFlowRuns = computed(() => recentRuns.value.map(run => run.flowId))
  const recentFlows = computed(() => [...new Set(recentFlowRuns.value)])
</script>

<style>
.overview-cards__card {
  @apply
  h-36
  overflow-auto
}
</style>