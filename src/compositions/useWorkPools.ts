import { MaybeRefOrGetter, toValue } from 'vue'
import { useCan } from '@/compositions/useCan'
import { PaginationOptions, UsePaginationEntity, usePagination } from '@/compositions/usePagination'
import { useWorkspaceApi } from '@/compositions/useWorkspaceApi'
import { WorkPoolsFilter } from '@/models'
import { WorkspaceWorkPoolsApi } from '@/services'
import { Getter } from '@/types/reactivity'

export type UseWorkPools = UsePaginationEntity<
WorkspaceWorkPoolsApi['getWorkPools'],
WorkspaceWorkPoolsApi['getWorkPoolsCount'],
'workPools'
>

export function useWorkPools(filter?: MaybeRefOrGetter<WorkPoolsFilter | null | undefined>, options?: PaginationOptions): UseWorkPools {
  const api = useWorkspaceApi()
  const can = useCan()

  const parameters: Getter<[WorkPoolsFilter?] | null> = () => {
    if (!can.read.work_pool) {
      return null
    }

    const value = toValue(filter)

    if (!value) {
      return null
    }

    return [value]
  }

  const pagination = usePagination({
    fetchMethod: api.workPools.getWorkPools,
    fetchParameters: parameters,
    countMethod: api.workPools.getWorkPoolsCount,
    countParameters: parameters,
    options,
  })

  return {
    ...pagination,
    workPools: pagination.results,
  }
}