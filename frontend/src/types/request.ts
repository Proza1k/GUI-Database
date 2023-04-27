import { Status } from './status'

export type RequestPayload<T> = {
  status: Status
  payload?: T
  message?: string
}
