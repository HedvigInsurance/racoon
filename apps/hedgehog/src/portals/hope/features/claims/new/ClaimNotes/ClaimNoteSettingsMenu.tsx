import { ClaimNoteFragment, ClaimNoteTag } from 'types/generated/graphql'
import { PopupMenuItem } from '@hedvig-ui/redesign'
import { convertEnumToTitle } from '@hedvig-ui'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { useClaimNoteTags } from './hooks'
import { TickIcon } from '@hedvig-ui/icons'

export const ClaimNoteSettingsMenu = (props: { note: ClaimNoteFragment }) => {
  const { note } = props
  const { claimId } = useClaim()
  const { toggleTag } = useClaimNoteTags({ claimId, note })

  return (
    <>
      {Object.values(ClaimNoteTag).map((tag) => {
        if (tag === ClaimNoteTag.Pinned) {
          return null
        }
        return (
          <PopupMenuItem key={tag} onClick={() => toggleTag(tag)}>
            {convertEnumToTitle(tag)}
            {note.tags.includes(tag) && <TickIcon />}
          </PopupMenuItem>
        )
      })}
    </>
  )
}
