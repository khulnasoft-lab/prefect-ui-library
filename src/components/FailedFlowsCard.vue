<template>
  <p-card>
    <p-content>
      Failed Flows
      <div v-for="flow in failedFlows" :key="flow.id">
        <p-link :to="routes.flow(flow.id)">
          {{ flow.name }}
        </p-link>
      </div>
    </p-content>
  </p-card>
  <!--
    <p-card>
    <p-content>
    Unhealthy Queues
    <div v-for="worker in workers" :key="worker.id">
    <div>
    {{ worker.name }}
    </div>
    <div>
    {{ worker }}
    </div>
    </div>
    </p-content>
    </p-card>
  -->

  <p-card>
    <p-content>
      Failed Work Queues
      <div v-for="queue, index in failedWorkQueues" :key="index">
        <div>
          {{ queue }}
        </div>
      </div>
    </p-content>
  </p-card>
  <p-card>
    <p-content>
      Failed Deployments
      <div v-for="deployment, index in failedDeployments" :key="index">
        <DeploymentIconText v-if="deployment" :deployment-id="deployment" />
      </div>
    </p-content>
  </p-card>
</template>

<script lang="ts" setup>
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import DeploymentIconText from '@/components/DeploymentIconText.vue'
  import { useWorkspaceApi, useFlowFilterFromRoute, useFlowRunFilterFromRoute, useWorkspaceRoutes } from '@/compositions'
  import { FlowFilter } from '@/types'
  import { dateFunctions } from '@/utilities/timezone'

  const routes = useWorkspaceRoutes()

  const api = useWorkspaceApi()
  const subscriptionOptions = {
    interval: 30000,
  }

  const flowFilter = useFlowFilterFromRoute().filter
  const defaultStartDate = dateFunctions.subDays(dateFunctions.startOfToday(), 2)

  const updatedFlowFilter: FlowFilter = {
    ...flowFilter.value,
    'flow_runs': {
      state: {
        type: {
          any_: ['FAILED'],
        },
      },
      'expected_start_time': {
        after_: defaultStartDate,
      },
    },
  }

  const flowsSubscription = useSubscription(api.flows.getFlows, [updatedFlowFilter], subscriptionOptions)
  const failedFlows = computed(() => flowsSubscription.response ?? [])

  // const workerFilter = {}
  // const workQueueSubscription = useSubscription(api.workQueues.getWorkQueues, [workerFilter], subscriptionOptions)
  // const workers = computed(() => workQueueSubscription.response ?? [])

  const flowRunFilter = useFlowRunFilterFromRoute().filter

  const updatedFlowRunFilter: FlowFilter = {
    ...flowRunFilter.value,
    'flow_runs': {
      state: {
        type: {
          any_: ['FAILED'],
        },
      },
      'expected_start_time': {
        after_: defaultStartDate,
      },
    },
  }
  const flowRunsSubscription = useSubscription(api.flowRuns.getFlowRuns, [updatedFlowRunFilter], subscriptionOptions)
  const failedRuns = computed(() => {
    return flowRunsSubscription.response ?? []
  })
  const failedWorkQueueRuns = computed(() => failedRuns.value.map(run => run.workQueueName))
  const failedWorkQueues = computed(() => [...new Set(failedWorkQueueRuns.value)])
  const failedDeploymentRuns = computed(() => failedRuns.value.map(run => run.deploymentId))
  const failedDeployments = computed(() => [...new Set(failedDeploymentRuns.value)])
</script>