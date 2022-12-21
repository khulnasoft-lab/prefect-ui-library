<template>
  <ComponentPage title="ParametersForm">
    <p-tabs :tabs="['Form', 'Table']">
      <template #form>
        <SchemaFormFields property="parameters" :schema="deployment.parameterOpenApiSchema" />
      </template>
      <template #table>
        <ParametersTable :parameters="parameters" :deployment="deployment" />
      </template>
    </p-tabs>
  </ComponentPage>
</template>

<script lang="ts" setup>
  import { ref, onBeforeMount } from 'vue'
  import { SchemaFormFields, ParametersTable } from '@/components'
  import ComponentPage from '@/demo/components/ComponentPage.vue'
  import { mocker } from '@/services'

  const deployment = ref()
  const parameters = ref()

  const refresh = (): void => {
    deployment.value = mocker.create('deployment')
    parameters.value = mocker.create('parameters', [{}, deployment.value.parameterOpenApiSchema])
  }

  onBeforeMount(refresh)
</script>