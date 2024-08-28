import { ClaimNoteFragment, ClaimNoteTag } from 'types/generated/graphql'
import { Flex, InfoTag } from '@hedvig-ui/redesign'
import { NOTE_TAG_VARIANT } from 'portals/hope/features/claims/new/ClaimNotes/helpers'
import { convertEnumToTitle } from '@hedvig-ui'

export const NoteTags = ({ tags }: { tags: ClaimNoteFragment['tags'] }) => {
  if (!tags.length) {
    return null
  }

  return (
    <Flex gap="tiny" wrap="wrap">
      {tags.map((tag) => {
        if (tag === ClaimNoteTag.Pinned) {
          return null
        }
        return (
          <InfoTag key={tag} variant={NOTE_TAG_VARIANT[tag]}>
            {convertEnumToTitle(tag)}
          </InfoTag>
        )
      })}
    </Flex>
  )
}
