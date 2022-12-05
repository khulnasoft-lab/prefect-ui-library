<!-- eslint-disable vue/html-indent -->
<template>
  <p-empty-state class="flow-runs-page-empty-state">
    <template #icon>
      <p-icon icon="FlowRun" /> Run a flow to get started
    </template>

    <template #heading />

    <template #description>
      <div class="cloud-int">
        <div class="mb-4">
          Install Prefect and log in
        </div>
        <p-terminal pre-command="Pip install -U prefect" command="prefect cloud login" />

        <div class="mb-4 mt-4">
          Run a flow
        </div>
        <div class="language-python">
        <pre>
          <code>
from prefect import flow

@flow
  def hello_flow():
    print('hello')

if __name__ == "__main__":
hello_flow()
          </code>
        </pre>
      </div>
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
  border-[1px]
  border-gray-300
  px-6
  py-6
  rounded-lg
  cursor-pointer

}

.language-python {
  @apply
bg-slate-700
  px-8
  text-slate-50
  rounded
}
</style>