<template>
  <DemoSection heading="Parameters Modal">
    <p-content>
      <JsonView label="Parameters" :value="stringifiedParameters" />

      <ParametersFormModal :schema="parsedDefinition" :parameters="parameters" @submit="handleSubmit">
        <template #default="{ open }">
          <div>
            <p-button size="sm" @click="open">
              Show parameters modal
            </p-button>
          </div>
        </template>
      </ParametersFormModal>
    </p-content>
  </DemoSection>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import DemoSection from '../components/DemoSection.vue'
  import JsonView from '@/components/JsonView.vue'
  import ParametersFormModal from '@/components/ParametersFormModal.vue'
  import type { PydanticTypeDefinition } from '@/types/Pydantic'

  type Parameters = Record<string, unknown>

  const rawDefinition = ref('{"title": "Parameters", "type": "object", "properties": {"description": {"title": "description", "type": "string"}, "valid": {"title": "valid", "type": "boolean"}, "created": {"title": "created", "type": "string", "format": "date-time"}, "tags": {"title": "tags", "type": "array", "items": {}}, "cost": {"title": "cost", "type": "number"}, "users": {"title": "users", "default": 0, "type": "integer"}, "category": {"title": "category", "default": "Math", "allOf": [{"$ref": "#/definitions/Categories"}]}}, "required": ["description", "valid", "created", "tags", "cost"], "definitions": {"Categories": {"title": "Categories", "description": "An enumeration.", "enum": ["Math", "Literature", "Fine Art", "Biology", "Chemistry", "Foreign Language", "Computer Science"], "type": "string"}}}')
  const parsedDefinition = computed<PydanticTypeDefinition>(() => {
    const parsed = JSON.parse(rawDefinition.value)
    return parsed.flow_parameter_schema ?? parsed
  })

  const parameters = ref({})

  const stringifiedParameters = computed(() => {
    return JSON.stringify(parameters.value)
  })

  const handleSubmit = (formParameters: Parameters): void => {
    parameters.value = formParameters
    console.log('new parameters', parameters.value)
  }
</script>