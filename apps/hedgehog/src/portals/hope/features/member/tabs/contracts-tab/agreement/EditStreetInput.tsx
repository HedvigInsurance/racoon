import { Input } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useSafelyEditAgreementMutation } from 'types/generated/graphql'

export const EditStreetInput: React.FC<{
  agreementId: string
  street: string
  closeEdit: () => void
}> = ({ agreementId, street, closeEdit }) => {
  const [newStreet, setNewStreet] = useState(street)
  const { confirm } = useConfirmDialog()

  const [safelyEditAgreement] = useSafelyEditAgreementMutation()

  return (
    <Input
      autoFocus
      value={newStreet}
      onChange={(e) => setNewStreet(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Escape)) {
          closeEdit()
          return
        }
        if (!isPressing(e, Keys.Enter)) {
          return
        }
        if (street.trim() === newStreet.trim()) {
          return
        }
        confirm(
          `Are you sure you want to change the street from "${street}" to "${newStreet}"?`,
        ).then(() => {
          toast.promise(
            safelyEditAgreement({
              variables: {
                agreementId,
                request: {
                  newStreet: newStreet.trim(),
                },
              },
            }),
            {
              loading: 'Changing street',
              success: () => {
                closeEdit()
                return 'Street changed'
              },
              error: 'Could not change street',
            },
          )
        })
      }}
    />
  )
}
