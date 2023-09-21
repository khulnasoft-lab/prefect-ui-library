<template>
  <p-combobox v-model="selected" v-model:search="search" :options="options" manual @bottom="next">
    <template #combobox-options-empty>
      No work pools
    </template>
    <template #default="scope">
      <slot v-bind="scope">
        <UseWorkPoolSlot v-if="isString(scope.value)" :work-pool-name="scope.value">
          <template #default="{ workPool }">
            {{ workPool.name }}
          </template>
        </UseWorkPoolSlot>
      </slot>
    </template>
    <template #option="{ option }">
      <slot name="option" :option="option" />
    </template>
  </p-combobox>
</template>

<script lang="ts" setup>
  import { PCombobox, SelectOption } from '@prefecthq/prefect-design'
  import { useDebouncedRef } from '@prefecthq/vue-compositions'
  import { computed, ref } from 'vue'
  import UseWorkPoolSlot from '@/components/UseWorkPoolSlot.vue'
  import { useWorkPools } from '@/compositions'
  import { WorkPoolsFilter } from '@/models/Filters'
  import { isString } from '@/utilities'

  const props = defineProps<{
    selected: string | string[] | null | undefined,
    allowUnset?: boolean,
  }>()

  const emit = defineEmits<{
    (event: 'update:selected', value: string | string[] | null): void,
  }>()

  const search = ref('')
  const searchDebounced = useDebouncedRef(search, 500)

  const selected = computed({
    get() {
      return props.selected ?? null
    },
    set(value) {
      emit('update:selected', value)
    },
  })

  const filter = (): WorkPoolsFilter => ({
    workPools: {
      nameLike: searchDebounced.value,
    },
    limit: 20,
  })

  const { workPools, next } = useWorkPools(filter, { mode: 'infinite' })

  const options = computed<SelectOption[]>(() => {
    const options: SelectOption[] = workPools.value.map(workPool => ({
      value: workPool.name,
      label: workPool.name,
    }))

    if (props.allowUnset) {
      options.unshift({
        value: null,
        label: 'None',
      })
    }

    return options
  })
</script>
