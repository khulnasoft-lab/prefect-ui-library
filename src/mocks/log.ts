import { floor, random } from '@/mocks/math'
import { Log } from '@/models/Log'
import { MockFunction } from '@/services/Mocker'

type LogLevel = 1 | 2 | 3 | 4 | 5
const logLevels: LogLevel[] = [1, 2, 3, 4, 5]

export const randomLogLevel: MockFunction<LogLevel> = function(level?: LogLevel) {
  return logLevels[floor(random() * logLevels.length)]
}

export const randomLog: MockFunction<Log> = function(log?: Partial<Log>) {
  return new Log({
    id: log?.id ?? this.create('string'),
    created: log?.created ?? this.create('date'),
    updated: log?.updated ?? this.create('date'),
    name: log?.name ?? this.create('string'),
    level: log?.level ?? this.create('logLevel'),
    message: log?.message ?? random() > 0.75 ? this.create('paragraph') : this.create('sentence'),
    timestamp: log?.timestamp ?? this.create('date'),
    flowRunId: log?.flowRunId ?? this.create('string'),
    taskRunId: log?.taskRunId ?? this.create('string'),
  })
}