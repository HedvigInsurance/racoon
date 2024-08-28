'use client'

import { useState } from 'react'
import * as React from 'react'
import {
  Button,
  ButtonsGroup,
  Input,
  Modal,
  ModalProps,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import styled from '@emotion/styled'

const Container = styled.div`
  padding: 1rem;
  width: 400px;
`

export const ConfirmWithValueModal: React.FC<
  {
    confirmValue: string
    resolve: () => void
  } & ModalProps
> = (props) => {
  const handleClose = () => {
    props.onClose()
  }
  const [confirmAttempt, setConfirmAttempt] = useState('')

  const resolve = () => {
    props.resolve()
    setConfirmAttempt('')
    handleClose()
  }

  return (
    <Modal
      onClose={handleClose}
      visible={props.visible}
      options={{ ...props.options }}
    >
      <Container>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            resolve()
          }}
        >
          <ThirdLevelHeadline>Confirm</ThirdLevelHeadline>
          <p>Type {props.confirmValue} to continue</p>
          <Input
            autoFocus
            label="Input"
            placeholder="Confirm"
            value={confirmAttempt}
            onChange={({ currentTarget: { value } }) =>
              setConfirmAttempt(value)
            }
          />
          <ButtonsGroup style={{ marginTop: '1rem' }}>
            <Button
              disabled={confirmAttempt !== props.confirmValue}
              status="success"
              type="submit"
              style={{ width: '100%' }}
            >
              Confirm
            </Button>
            <Button
              variant="tertiary"
              type="button"
              style={{ width: '100%' }}
              onClick={handleClose}
            >
              Discard
            </Button>
          </ButtonsGroup>
        </form>
      </Container>
    </Modal>
  )
}
