import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { EventEntry } from './EventEntry'
import { PropsWithSwitcherCase } from '../page'

export function RecentEventCell({ switcher }: PropsWithSwitcherCase) {
  if (!switcher.events.length) {
    return <span className={cssUtil.textMuted}>No events yet</span>
  }

  const sortedEvents = switcher.events.toSorted((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  )
  const mostRecentEvent = sortedEvents.at(-1)!
  return <EventEntry switcher={switcher} event={mostRecentEvent} />
}
