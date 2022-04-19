import { pushToGTMDataLayer } from './gtm'

const FLOW_TYPE_KEY = '_HEDVIG_EMBARK_STORY'

type FlowTypeOption = 'ssn_input' | string

export const FlowType = {
  save: (option: FlowTypeOption) => window.sessionStorage.setItem(FLOW_TYPE_KEY, option),
  get: () => window.sessionStorage.getItem(FLOW_TYPE_KEY),
}

export type Event = 'begin_onboarding_flows' | 'ssn_fetching_failed'

export const beginOnboarding = (flowType: FlowTypeOption) => {
  track('begin_onboarding_flows', { offerData: { flow_type: flowType } })
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
