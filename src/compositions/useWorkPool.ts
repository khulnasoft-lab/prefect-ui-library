import { useSubscriptionWithDependencies } from '@prefecthq/vue-compositions'
import { computed, MaybeRefOrGetter, toValue } from 'vue'
import { useCan } from '@/compositions/useCan'
import { useWorkspaceApi } from '@/compositions/useWorkspaceApi'
import { WorkspaceWorkPoolsApi } from '@/services/WorkspaceWorkPoolsApi'
import { UseEntitySubscription } from '@/types/useEntitySubscription'

export type UseWorkPool = UseEntitySubscription<WorkspaceWorkPoolsApi['getWorkPoolByName'], 'workPool'>

export function useWorkPool(workPoolName: MaybeRefOrGetter<string | null | undefined>): UseWorkPool {
  const api = useWorkspaceApi()
  const can = useCan()

  const parameters = computed<[string] | null>(() => {
    if (!can.read.work_pool) {
      return null
    }

    const value = toValue(workPoolName)

    if (!value) {
      return null
    }

    return [value]
  })

  const subscription = useSubscriptionWithDependencies(api.workPools.getWorkPoolByName, parameters)
  const workPool = computed(() => subscription.response)

  return {
    subscription,
    workPool,
  }
}