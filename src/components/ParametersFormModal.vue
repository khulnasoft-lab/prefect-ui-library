<template>
  <slot :open="open" :close="close" />
  <p-modal v-model:showModal="showModal" class="parameters-form-modal" title="Edit parameters">
    <p-label label="Mode">
      <p-button-group v-model="parametersForm" :options="parameterFormOptions" size="sm" />
    </p-label>

    <template v-if="parametersForm == 'default'">
      <PydanticForm v-model="internalParameters" :pydantic-schema="schema" hide-footer />
    </template>

    <template v-else-if="parametersForm == 'json'">
      <JsonEditor v-model="stringValue" />
    </template>

    <template #actions>
      <p-button type="submit" @click="submit">
        Save
      </p-button>
    </template>
  </p-modal>
</template>

<script lang="ts" setup>
  import { ButtonGroupOption } from '@prefecthq/prefect-design'
  import { computed, ref } from 'vue'
  import JsonEditor from './JsonEditor.vue'
  import PydanticForm from './PydanticForm.vue'
  import { useShowModal } from '@/compositions'
  import type { PydanticTypeDefinition } from '@/types/Pydantic'

  const { showModal, open, close } = useShowModal()
  type Parameters = Record<string, unknown>

  const props = defineProps<{
    schema: PydanticTypeDefinition,
    parameters?: Parameters,
  }>()

  const emit = defineEmits<{
    (event: 'submit', value: Parameters): void,
  }>()

  const internalParameters = ref(props.parameters ?? {})
  const stringValue = computed({
    get() {
      return JSON.stringify(internalParameters.value)
    },
    set(val) {
      try {
        internalParameters.value = JSON.parse(val)
      } catch {
      // Do nothing
      }
    },
  })
  const parametersForm = ref('default')
  const parameterFormOptions: ButtonGroupOption[] = [{ label: 'Default', value: 'default' }, { label: 'JSON', value: 'json' }]
  const submit = (): void => {
    emit('submit', internalParameters.value)
    close()
  }
</script>