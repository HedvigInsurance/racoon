import { Placeholder } from '@hedvig-ui'
import { Flex } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'
import { format } from 'date-fns'

export const ClaimDate = ({ date }: { date: Date | undefined }) => {
  if (!date) {
    return <Placeholder>Unknown</Placeholder>
  }
  return (
    <Flex direction="column">
      <span>{format(date, 'dd MMMM, yyyy')}</span>
      <span className={cssUtil.columnSubText}>{format(date, 'HH:mm')}</span>
    </Flex>
  )
}
