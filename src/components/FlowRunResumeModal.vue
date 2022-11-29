<template>
  <p-modal v-if="flowRun" v-model:showModal="internalValue" title="Resume Flow Run">
    <div class="flow-run-resume-modal__message">
      This will put flow run {{ flowRun.name }} into a <StateBadge :state="{ name: 'Running', type: 'running' }" class="flow-run-resume-modal__state-badge" /> state.
    </div>

    <template #actions>
      <p-button @click="resume">
        Resume
      </p-button>
    </template>
  </p-modal>
</template>

<script lang="ts" setup>
  import { showToast } from '@prefecthq/prefect-design'
  import { useSubscription } from '@prefecthq/vue-compositions'
  import { computed } from 'vue'
  import StateBadge from './StateBadge.vue'
  import { useWorkspaceApi } from '@/compositions'
  import { localization } from '@/localization'
  import {  StateUpdateDetails } from '@/models'
  const props = defineProps<{
    showModal: boolean,
    flowRunId: string,
  }>()
  const emit = defineEmits<{
    (event: 'update:showModal', value: boolean): void,
    (event: 'resume'): void,
  }>()
  const api = useWorkspaceApi()
  const internalValue = computed({
    get() {
      return props.showModal
    },
    set(value: boolean) {
      emit('update:showModal', value)
    },
  })
  const flowRunSubscription =  useSubscription(api.flowRuns.getFlowRun, [props.flowRunId], { interval: 30000 })
  const flowRun = computed(() => flowRunSubscription.response)
  const resume  = async (): Promise<void>=> {
    try {
      const values: StateUpdateDetails = {
        type: 'running',
        name: 'Running',
      }
      await api.flowRuns.setFlowRunState(props.flowRunId, { state: values })
      flowRunSubscription.refresh()
      showToast(localization.success.resumeFlowRun, 'success')
    } catch (error) {
      console.error(error)
      showToast(localization.error.resumeFlowRun, 'error')
    } finally {
      internalValue.value = false
    }
  }
</script>

<style>
.flow-run-resume-modal__message { @apply
  inline-flex
  flex-wrap
  gap-1
  items-center
}

/* .flow-run-resume-modal__state-badge {
  inline-size: max-content;
} */
</style>