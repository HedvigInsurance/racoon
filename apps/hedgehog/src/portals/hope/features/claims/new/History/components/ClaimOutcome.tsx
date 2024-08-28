import { Placeholder, convertEnumToSentence } from '@hedvig-ui'

export const ClaimOutcome = ({
  outcome,
}: {
  outcome: string | null | undefined
}) => {
  if (!outcome) {
    return <Placeholder>Not applicable</Placeholder>
  }

  return convertEnumToSentence(outcome)
}
