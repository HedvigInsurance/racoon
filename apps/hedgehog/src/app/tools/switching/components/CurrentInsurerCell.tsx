import { Flex } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import clsx from 'clsx'
import { formatTime } from '../utils'
import { PropsWithSwitcherCase } from '../page'

export function CurrentInsurerCell({ switcher }: PropsWithSwitcherCase) {
  const initialContact = switcher.events.find(
    (e) => e.type == 'ORIGINAL_EMAIL_SENT',
  )

  return (
    <Flex direction="column">
      {switcher.currentInsurer}
      {initialContact && (
        <span className={clsx(cssUtil.textMuted, cssUtil.textSmaller)}>
          Contacted: {formatTime(initialContact.createdAt)}
        </span>
      )}
    </Flex>
  )
}
