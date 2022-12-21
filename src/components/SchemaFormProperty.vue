<template>
  <div class="schema-form-property">
    <p-checkbox v-model="enabled" />
    <component :is="is" v-if="enabled" v-bind="{ property, propKey, enabled }" />
    <component :is="is" v-else v-bind="{ property, propKey, enabled }" />
  </div>
</template>

<script lang="ts" setup>
  import { useFieldValue } from 'vee-validate'
  import { computed, ref } from 'vue'
  import SchemaFormInput from '@/components/SchemaFormInput.vue'
  import SchemaFormProperties from '@/components/SchemaFormProperties.vue'
  import SchemaFormPropertyAllOf from '@/components/SchemaFormPropertyAllOf.vue'
  import SchemaFormPropertyAnyOf from '@/components/SchemaFormPropertyAnyOf.vue'
  import { SchemaProperty, schemaHas } from '@/types/schemas'

  const props = defineProps<{
    propKey: string,
    property: SchemaProperty,
  }>()

  console.log(props.property)
  const fieldValue = useFieldValue(props.propKey)
  console.log(fieldValue)
  const enabled = ref(fieldValue.value !== undefined)

  const is = computed(() => {
    if (schemaHas(props.property, 'meta')) {
      return SchemaFormInput
    }

    if (schemaHas(props.property, 'properties')) {
      return SchemaFormProperties
    }

    if (schemaHas(props.property, 'allOf')) {
      return SchemaFormPropertyAllOf
    }

    if (schemaHas(props.property, 'anyOf')) {
      return SchemaFormPropertyAnyOf
    }

    return SchemaFormInput
  })
</script>

<style>
.schema-form-property { @apply
  flex
  gap-2
  items-start
}
</style>