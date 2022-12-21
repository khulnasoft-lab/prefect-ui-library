<template>
  <ComponentPage title="ParametersForm">
    <template #description>
      <p>
        This component is used to update parameters on the deployment model and to
        send parameters with a new flow run.
      </p>

      <div class="flex gap-4">
        <p-button size="sm" solid @click.stop.prevent="showValueModal = true">
          Value
        </p-button>
        <p-modal v-model:show-modal="showValueModal" title="Form value">
          <JsonView multiline :value="stringifiedValue" />

          <template #cancel>
            <p-button inset @click="showValueModal = false">
              Close
            </p-button>
          </template>
        </p-modal>

        <p-button flat size="sm" icon="RefreshIcon" @click="refresh">
          Refresh data
        </p-button>
      </div>
    </template>

    <p-tabs :tabs="['Form', 'Table']">
      <template #form>
        <SchemaFormFields v-model="value" property="parameters" :schema="deployment.parameterOpenApiSchema" />
      </template>
      <template #table>
        <ParametersTable :parameters="parameters" :deployment="deployment" />
      </template>
    </p-tabs>
  </ComponentPage>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount, computed } from 'vue'
  import { SchemaFormFields, ParametersTable, JsonView } from '@/components'
  import ComponentPage from '@/demo/components/ComponentPage.vue'
  import { mocker } from '@/services'

  const deployment = ref()
  const parameters = ref()

  const value = ref({})
  const stringifiedValue = computed(() => JSON.stringify(value.value, null, 2))
  const showValueModal = ref(false)

  const refresh = (): void => {
    deployment.value = mocker.create('deployment')
    parameters.value = mocker.create('parameters', [{}, deployment.value.parameterOpenApiSchema])

    value.value = parameters.value
  }

  onBeforeMount(refresh)
</script>