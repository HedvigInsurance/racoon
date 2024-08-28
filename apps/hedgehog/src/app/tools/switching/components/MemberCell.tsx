import { Flex } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import clsx from 'clsx'
import Link from 'next/link'
import { SwitcherCaseFragment } from 'types/generated/graphql'

export function MemberCell({ switcher }: { switcher: SwitcherCaseFragment }) {
  return (
    <Flex direction="column">
      <Link href={`/members/${switcher.member.memberId}`}>
        {switcher.member.firstName} {switcher.member.lastName} (
        {switcher.member.memberId})
      </Link>
      <span className={clsx(cssUtil.textMuted, cssUtil.textSmaller)}>
        {switcher.member.email}
      </span>
    </Flex>
  )
}
