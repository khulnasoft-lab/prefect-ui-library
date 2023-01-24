<template>
  <PSelect v-model="model" :options="options" class="block-type-select">
    <template #default="{ label }">
      {{ label }}
    </template>
  </PSelect>
</template>

<script lang="ts" setup>
  import { SelectOption } from '@prefecthq/prefect-design'
  import { computed } from 'vue'
  import { WorkPoolType, workPoolTypes } from '@/models'

  const props = defineProps<{
    selected: string | null,
  }>()

  const emit = defineEmits<{
    (event: 'update:selected', value: string | null): void,
  }>()

  const model = computed({
    get() {
      return props.selected
    },
    set(value: string | null) {
      emit('update:selected', value)
    },
  })

  const options = computed<SelectOption[]>(() => {
    const options: { label: string, value: WorkPoolType }[] = workPoolTypes.map((type) => ({
      label: type,
      value: type,
    }))

    return options
  })
</script>