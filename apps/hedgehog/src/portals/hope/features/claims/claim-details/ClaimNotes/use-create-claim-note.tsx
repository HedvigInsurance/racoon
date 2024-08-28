import { ClaimNoteType, useAddClaimNoteMutation } from 'types/generated/graphql'
import { toast } from 'react-hot-toast'
import gql from 'graphql-tag'
import { PushUserAction } from '@hope/features/tracking/utils/tags'
import { extractErrorMessage } from '@hedvig-ui'

gql`
  mutation AddClaimNote($claimId: ID!, $note: ClaimNoteInput!) {
    addClaimNote(claimId: $claimId, input: $note) {
      id
      notes {
        ...ClaimNote
      }
    }
  }
`

export const useCreateClaimNote = () => {
  const [addClaimNote, { loading: creating }] = useAddClaimNoteMutation()

  const createNote = async (
    claimId: string,
    text: string,
    type: ClaimNoteType,
  ) => {
    PushUserAction('claim', 'add', 'note', null)

    await toast.promise(
      addClaimNote({
        variables: {
          claimId,
          note: { text, type },
        },
      }),
      {
        loading: 'Adding note...',
        success: 'Note added',
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  return {
    createNote,
    creating,
  }
}
