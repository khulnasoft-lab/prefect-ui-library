import { MockApi } from '@/../demo/services/MockApi'
import { FlowRun, GraphNode, RunHistory, StateUpdate, TimelineNode } from '@/models'
import { FlowRunsSurveyResult } from '@/models/FlowRunsSurveyResult'
import { IWorkspaceFlowRunsApi, mapper, mocker } from '@/services'
import { UnionFilters, FlowRunsHistoryFilter, DateString } from '@/types'
import { dateFunctions } from '@/utilities/timezone'

export class MockWorkspaceFlowRunsApi extends MockApi implements IWorkspaceFlowRunsApi {

  public async getFlowRun(flowRunId: string): Promise<FlowRun> {
    return await this.flowRuns.get(flowRunId)
  }

  public async getFlowRuns(filter: UnionFilters): Promise<FlowRun[]> {
    if (Object.keys(filter).length) {
      console.warn('MockWorkspaceFlowRunsApi has not implemented the filter argument of the getFlowRuns method')
    }

    return await this.flowRuns.getAll()
  }

  public async getFlowRunsCount(filter: UnionFilters): Promise<number> {
    if (Object.keys(filter).length) {
      console.warn('MockWorkspaceFlowRunsApi has not implemented the filter argument of the getFlowRunsCount method')
    }

    return await this.flowRuns.count()
  }

  public getFlowRunsHistory(filter: FlowRunsHistoryFilter): Promise<RunHistory[]> {
    let start = mapper.map('string', filter.history_start, 'Date')
    const end = mapper.map('string', filter.history_end, 'Date')
    const runHistory: RunHistory[] = []

    console.log({ start, end, interval: filter.history_interval_seconds })

    while (dateFunctions.isBefore(start, end)) {
      const intervalEnd = dateFunctions.addSeconds(start, filter.history_interval_seconds)

      runHistory.push({
        intervalStart: start,
        intervalEnd,
        states: mocker.createMany('flowRunStateHistory', mocker.create('number', [0, 3])),
      })
      start = intervalEnd
    }

    return Promise.resolve(runHistory)
  }

  public getFlowRunsGraph(): Promise<GraphNode[]> {
    throw new Error('MockWorkspaceFlowRunsApi has not implemented the getFlowRunGraph method')
  }

  public getFlowRunsTimeline(): Promise<TimelineNode[]> {
    throw new Error('MockWorkspaceFlowRunsApi has not implemented the getFlowRunGraph method')
  }

  public async retryFlowRun(): Promise<void> {
    return await Promise.resolve()
  }

  public async setFlowRunState(flowRunId: string, body: StateUpdate): Promise<void> {
    const flowRun = this.flowRuns.get(flowRunId)
    flowRun.state = mocker.create('state', [body.state])
    flowRun.stateType = flowRun.state.type

    return await Promise.resolve()
  }

  public resumeFlowRun(flowRunId: string): Promise<void> {
    const flowRun = this.flowRuns.get(flowRunId)
    flowRun.stateType = 'running'

    this.flowRuns.patch(flowRunId, flowRun)

    return Promise.resolve()
  }

  public async deleteFlowRun(flowRunId: string): Promise<void> {
    return await this.flowRuns.delete(flowRunId)
  }

  public getFlowRunsSurveyResults(filter: UnionFilters = {}): Promise<Map<DateString, FlowRunsSurveyResult>> {
    let start = dateFunctions.startOfMonth(dateFunctions.startOfToday())

    if (filter.flow_runs?.expected_start_time?.after_) {
      start = mapper.map('string', filter.flow_runs.expected_start_time.after_, 'Date')
    }

    let end = dateFunctions.endOfMonth(dateFunctions.startOfToday())
    if (filter.flow_runs?.expected_start_time?.before_) {
      end = mapper.map('string', filter.flow_runs.expected_start_time.before_, 'Date')
    }

    const map = new Map(dateFunctions.eachDayOfInterval({ start, end }).map(date => {
      const result = mocker.create('flowRunsSurveyResult', [{ date }])
      return [date.toISOString(), result]
    }))

    return Promise.resolve(map)
  }

}
