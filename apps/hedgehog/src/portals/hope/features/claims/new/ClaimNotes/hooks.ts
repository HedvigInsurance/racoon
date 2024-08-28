import toast from 'react-hot-toast'
import { extractErrorMessage } from '@hedvig-ui'
import {
  ClaimNoteFragment,
  ClaimNoteTag,
  useTagClaimNoteMutation,
} from 'types/generated/graphql'

export const useClaimNoteTags = ({
  claimId,
  note,
}: {
  claimId: string
  note: ClaimNoteFragment
}) => {
  const { tags } = note
  const [tagNote] = useTagClaimNoteMutation()
  const isPinned = tags.includes(ClaimNoteTag.Pinned)
  const hasTags =
    note.tags.filter((tag) => tag !== ClaimNoteTag.Pinned).length > 0

  const toggleTag = async (tag: ClaimNoteTag) => {
    const removingTag = tags.includes(tag)
    const newTags = removingTag ? tags.filter((t) => t !== tag) : [...tags, tag]

    await toast.promise(
      tagNote({
        variables: {
          claimId: claimId,
          noteId: note.id,
          tags: newTags,
        },
      }),
      {
        loading: removingTag ? 'Removing tag...' : 'Adding tag...',
        success: removingTag ? 'Tag removed' : 'Tag added',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return {
    toggleTag,
    tags,
    isPinned,
    hasTags,
  }
}
