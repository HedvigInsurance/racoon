import { EntryPoint } from '@/pages/new-member/start/shared'
import { pushToGTMDataLayer } from './gtm'

const FLOW_TYPE_COOKIE_KEY = '_hv_flow_type'

type FlowTypeOption = 'ssn_input' | string

export const FlowType = {
  save: (option: FlowTypeOption) => window.sessionStorage.setItem(FLOW_TYPE_COOKIE_KEY, option),
  get: () => window.sessionStorage.getItem(FLOW_TYPE_COOKIE_KEY),
}

export type Event = 'begin_onboarding' | 'ssn_fetching_failed'

export const beginOnboarding = (entryPoint: EntryPoint) => {
  const flowType = entryPoint === EntryPoint.Current ? 'ssn_input' : entryPoint
  track('begin_onboarding', { offerData: { flow_type: flowType } })
  FlowType.save(flowType)
}

export const ssnFetchingFailed = () => {
  track('ssn_fetching_failed')
}

type Options = {
  offerData?: Record<string, string>
}

export const track = (event: Event, { offerData = {} }: Options = {}) => {
  pushToGTMDataLayer({ event, offerData })
}
