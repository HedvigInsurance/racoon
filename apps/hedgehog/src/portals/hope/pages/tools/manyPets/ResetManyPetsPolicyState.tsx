import { useState } from 'react'
import { Button, Card, Flex, Modal } from '@hedvig-ui'
import {
  ManyPetsPolicyState,
  useSetManyPetsPolicyStateMutation,
} from 'types/generated/graphql'

const ResetManyPetsPolicyState = ({ policyId }: { policyId: string }) => {
  const [showModal, setShowModal] = useState(false)

  const [setManyPetsPolicyState] = useSetManyPetsPolicyStateMutation({
    variables: {
      id: policyId,
      state: ManyPetsPolicyState.Registered,
    },
  })

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        Reset policy state
      </Button>
      <Modal
        title="Reset policy state"
        onClose={() => {
          setShowModal(false)
        }}
        visible={showModal}
      >
        <Card>
          <h2>Reset policy state</h2>
          <p>
            Are you sure you want to reset the state of this policy? This will
            set policy state to <strong> REGISTERED </strong>
          </p>

          <Flex direction="row" gap="medium">
            <Button
              onClick={() => {
                setManyPetsPolicyState()
                setShowModal(false)
              }}
              status="success"
            >
              Reset policy state
            </Button>
            <Button
              onClick={() => {
                setShowModal(false)
              }}
              status="danger"
            >
              Cancel
            </Button>
          </Flex>
        </Card>
      </Modal>
    </>
  )
}

export { ResetManyPetsPolicyState }
