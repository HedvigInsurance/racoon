import { convertEnumToSentence } from '@hedvig-ui'
import { ConversationFragment } from 'types/generated/graphql'
import { format } from 'date-fns/format'

export function getTitleForConversation(
  conversation: ConversationFragment,
): string {
  if (conversation.claim) {
    return (
      conversation.claim?.subclaims?.[0]?.claimType?.displayName ?? 'New claim'
    )
  }
  const latestArea = conversation.latestTask?.area
  if (latestArea) {
    return `Area: ${convertEnumToSentence(latestArea)}`
  }
  return 'New question'
}

export function getSubtitleForConversation(
  conversation: ConversationFragment,
): string | null {
  if (conversation.claim) {
    return `Claim number: ${conversation.claim.claimNumber}`
  }
  return null
}

export function getDateFooterForConversation(
  conversation: ConversationFragment,
): string | null {
  if (conversation.claim) {
    return conversation.claim.dateOfOccurrence
      ? `Date of occurrence: ${format(conversation.claim.dateOfOccurrence, 'y-MM-dd')}`
      : `Opened at: ${format(conversation.claim.openedAt, 'y-MM-dd')}`
  }
  return `Date of submission: ${format(conversation.createdAt, 'y-MM-dd')}`
}
