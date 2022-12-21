<template>
  <ComponentPage title="ParametersForm">
    <p-tabs :tabs="['Form', 'Table']">
      <template #form>
        {{ deployment.parameterOpenApiSchema }}
      </template>
      <template #table>
        <ParametersTable :parameters="parameters" :deployment="deployment" />
        {{ parameters }}
      </template>
    </p-tabs>
  </ComponentPage>
</template>

<script lang="ts" setup>
  import ParametersTable from '@/components/ParametersTable.vue'
  import ComponentPage from '@/demo/components/ComponentPage.vue'
  import { mocker } from '@/services'

  const deployment = mocker.create('deployment')
  const parameters = mocker.create('parameters', [deployment.parameterOpenApiSchema])
</script>