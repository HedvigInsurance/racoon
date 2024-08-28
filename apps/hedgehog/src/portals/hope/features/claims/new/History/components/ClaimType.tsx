import { Placeholder, convertEnumToSentence } from '@hedvig-ui'

export const ClaimType = ({ type }: { type: string | null | undefined }) => {
  if (!type) {
    return <Placeholder>Unknown</Placeholder>
  }
  return convertEnumToSentence(type)
}
