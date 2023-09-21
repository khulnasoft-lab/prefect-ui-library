<template>
  <slot v-if="workPool" :work-pool="workPool" />
</template>

<script lang="ts" setup>
  import { useWorkPool } from '@/compositions/useWorkPool'

  const props = defineProps<{
    workPoolName: string | null | undefined,
  }>()

  const { workPool } = useWorkPool(() => props.workPoolName)
</script>