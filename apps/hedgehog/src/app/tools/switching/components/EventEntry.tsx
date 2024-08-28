'use client'

import { ReactNode } from 'react'

import clsx from 'clsx'

import { Flex, Tooltip } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

import type { SwitcherCaseEventFragment } from 'types/generated/graphql'

import { formatTime } from '../utils'

import { eventEmoji, timestamp } from '../SwitchingPage.css'
import { PropsWithSwitcherCase } from '../page'

type EventEntryProps = {
  event: SwitcherCaseEventFragment
  includeAuthor?: boolean
}

export function EventEntry({
  switcher,
  event,
  includeAuthor,
}: PropsWithSwitcherCase<EventEntryProps>) {
  let emoji = ''
  let tooltip = ''
  let description: ReactNode = ''

  switch (event.type) {
    case 'ORIGINAL_EMAIL_SENT':
      emoji = '✉️'
      tooltip = 'Email sent'
      description = `Original email to ${switcher.currentInsurer}`
      break
    case 'REMINDER_EMAIL_SENT':
      emoji = '✉️'
      tooltip = 'Email sent'
      description = `Automated reminder email to ${switcher.currentInsurer}`
      break
    case 'NOTE_ADDED':
      emoji = '📝'
      tooltip = 'Note added'
      description = <i>"{event.note}"</i>
      break
    case 'MANUAL_REMINDER_SENT':
      emoji = '🔔'
      tooltip = 'Reminder sent'
      description = 'Manual reminder sent to insurance company'
      break
  }

  return (
    <Flex align="center" gap={'sm'}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className={eventEmoji}>{emoji}</span>
        </Tooltip.Trigger>
        <Tooltip.Content>{tooltip}</Tooltip.Content>
      </Tooltip.Root>

      <div>
        <span className={timestamp}>({formatTime(event.createdAt)})</span>
      </div>

      <div>
        {description}
        {event.actor && includeAuthor && (
          <span className={clsx(cssUtil.textMuted, cssUtil.textSmaller)}>
            {' '}
            - {event.actor.name}
          </span>
        )}
      </div>
    </Flex>
  )
}
