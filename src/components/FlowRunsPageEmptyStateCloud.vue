<template>
  <p-empty-state class="flow-runs-page-empty-state">
    <template #icon>
      <p-icon icon="FlowRun" />
    </template>

    <template #heading>
      Run a flow to get started
    </template>

    <template #description>
      <div class="cloud-int">
        <div>
          Install Prefect and log in
        </div>
        <p-terminal command="Pip install -U prefect" pre-command="prefect cloud login" />


        Run a flow
        <p-code multiline>
          <div>from prefect import Flow</div>
          <div>@flow</div>
          <div>def hello_flow</div>
        </p-code>
      </div>
    </template>
    <template #actions>
      <DocumentationButton topic="gettingStarted">
        Find Out More
      </DocumentationButton>
    </template>
  </p-empty-state>
</template>

<script lang="ts" setup>
  import { PEmptyState, PIcon } from '@prefecthq/prefect-design'
  import DocumentationButton from './DocumentationButton.vue'
</script>

<style>
.cloud-int {
  @apply
  text-left
}
</style>