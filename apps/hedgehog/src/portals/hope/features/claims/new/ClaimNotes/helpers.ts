import { ComponentProps } from 'react'
import { InfoTag } from '@hedvig-ui/redesign'
import { ClaimNoteTag } from 'types/generated/graphql'

export const NOTE_TAG_VARIANT: Record<
  ClaimNoteTag,
  ComponentProps<typeof InfoTag>['variant']
> = {
  [ClaimNoteTag.Pinned]: 'success',
  [ClaimNoteTag.ClaimInfo]: 'info',
  [ClaimNoteTag.MemberInfo]: 'warning',
  [ClaimNoteTag.PayoutInfo]: 'danger',
}
