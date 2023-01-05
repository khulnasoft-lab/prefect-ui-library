<template>
  <p-card>
    <p-content>
      Failed Flows
      <div v-for="flow, index in failedFlows" :key="index">
        <FlowIconText :flow-id="flow" />
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
  import { computed, watch, Ref } from 'vue'
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

  const updatedFlowRunFilter = computed(() => {
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

  // watch(tags, () => {
  //   console.log('tags', tags.value)
  //   updatedFlowRunFilter.value.flow_runs.tags = {
  //     all_: tags.value,
  //   }
  //   console.log(updatedFlowRunFilter.value)
  // },
  // )

  const flowRunsSubscription = useSubscription(api.flowRuns.getFlowRuns, [updatedFlowRunFilter], subscriptionOptions)
  const failedRuns = computed(() => {
    return flowRunsSubscription.response ?? []
  })
  const failedWorkQueueRuns = computed(() => failedRuns.value.map(run => run.workQueueName))
  const failedWorkQueues = computed(() => [...new Set(failedWorkQueueRuns.value)])
  const failedDeploymentRuns = computed(() => failedRuns.value.map(run => run.deploymentId))
  const failedDeployments = computed(() => [...new Set(failedDeploymentRuns.value)])
  const failedFlowRuns = computed(() => failedRuns.value.map(run => run.flowId))
  const failedFlows = computed(() => [...new Set(failedFlowRuns.value)])
</script>