import * as Analytics from '@/services/analytics/analytics'
import { Embark } from '@/services/embark'
import { EntryPoint, InputField } from './StartPage.constants'

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

const entryPointToSwedishEmbarkStory = (entryPoint: EntryPoint) => {
  switch (entryPoint) {
    case EntryPoint.Current:
      return Embark.Story.SwedenNeeder
    case EntryPoint.New:
      return Embark.Story.SwedenNeeder
    case EntryPoint.Switch:
      return Embark.Story.SwedenSwitcher
  }
}

export const handleSubmitForm = (formData: FormData) => {
  const entryPoint = formData.get(InputField.EntryPoint)

  if (!isEntryPoint(entryPoint)) return

  Analytics.beginOnboarding(entryPointToFlowType(entryPoint))

  const personalNumber = formData.get(InputField.PersonalNumber)
  if (typeof personalNumber === 'string') {
    const swedishEmbarkStory = entryPointToSwedishEmbarkStory(entryPoint)
    Embark.setStoryStore(swedishEmbarkStory, { personalNumber })
  }
}

export const isEntryPoint = (entryPoint: unknown): entryPoint is EntryPoint => {
  return Object.values(EntryPoint).includes(entryPoint as EntryPoint)
}
