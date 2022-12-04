<template>
  <p-empty-state class="flow-runs-page-empty-state">
    <template #icon>
      <p-icon icon="FlowRun" />
    </template>

    <template #heading>
      Run a flow to get started
    </template>

    <template #description>
      <div>
        Install Prefect and log in
      </div>
      <p-terminal command="Pip install -U prefect" pre-command="prefect cloud login" />
      Run a flow
      <p-terminal pre-command="from prefect import flow" command="@flow...">
        <template #actions>
          <DocumentationButton topic="gettingStarted">
            Find Out More
          </DocumentationButton>
        </template>
      </p-terminal>
    </template>
  </p-empty-state>
</template>

<script lang="ts" setup>
  import { PEmptyState, PIcon } from '@prefecthq/prefect-design'
  import DocumentationButton from './DocumentationButton.vue'
</script>