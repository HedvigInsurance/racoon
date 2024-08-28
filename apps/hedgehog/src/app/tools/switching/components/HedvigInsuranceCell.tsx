import { Flex } from '@hedvig-ui/redesign'
import clsx from 'clsx'

import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

import { formatTime } from '../utils'

import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { PropsWithSwitcherCase } from '../page'

export function HedvigInsuranceCell({ switcher }: PropsWithSwitcherCase) {
  return (
    <Flex direction="column">
      {convertEnumToTitle(switcher.pendingContract.insuranceType)}
      <span className={clsx(cssUtil.textMuted, cssUtil.textSmaller)}>
        Signed: {formatTime(switcher.pendingContract.createdAt)}
      </span>
    </Flex>
  )
}
