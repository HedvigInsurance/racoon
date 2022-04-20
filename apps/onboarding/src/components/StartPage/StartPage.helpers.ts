import * as Analytics from '@/services/analytics/analytics'
import { EntryPoint } from './StartPage.constants'

const entryPointToFlowType = (entryPoint: EntryPoint) => {
  switch (entryPoint) {
    case EntryPoint.Current:
      return 'ssn_input'
    case EntryPoint.New:
      return 'needer'
    case EntryPoint.Switch:
      return 'switcher'
  }
}

export const trackBeginOnboardingFlows = (entryPoint: unknown) => {
  if (isEntryPoint(entryPoint)) {
    Analytics.beginOnboarding(entryPointToFlowType(entryPoint))
  }
}

export const isEntryPoint = (entryPoint: unknown): entryPoint is EntryPoint => {
  return Object.values(EntryPoint).includes(entryPoint as EntryPoint)
}
