import { Flex } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

import { EventEntry } from './EventEntry'

import { switcherCaseDetails } from '../SwitchingPage.css'

import { PropsWithSwitcherCase } from '../page'
import { PropsWithChildren } from 'react'

function SwitcherCaseDetails({ children }: PropsWithChildren) {
  return (
    <Flex
      m="md"
      p="lg"
      direction="column"
      gap="lg"
      className={switcherCaseDetails}
    >
      {children}
    </Flex>
  )
}

function SwitcherCaseEvents({ switcher }: PropsWithSwitcherCase) {
  return (
    <div>
      {switcher.events.length ? (
        switcher.events.map((e) => (
          <EventEntry switcher={switcher} event={e} key={e.id} includeAuthor />
        ))
      ) : (
        <span className={cssUtil.textMuted}>No events yet</span>
      )}
    </div>
  )
}

function SwitcherCaseActions({ children }: PropsWithChildren) {
  return <Flex gap="sm">{children}</Flex>
}

export default {
  Root: SwitcherCaseDetails,
  Events: SwitcherCaseEvents,
  Actions: SwitcherCaseActions,
}
