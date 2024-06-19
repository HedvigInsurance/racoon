import styled from '@emotion/styled'
import type { FormEventHandler } from 'react'
import { BankIdIcon, Button, theme } from 'ui'
import { BankIdState } from '@/services/bankId/bankId.types'

type Props = {
  state: BankIdState
  title: string
  onLoginStart: () => void
}
export const BankIdLoginForm = ({ state, title, onLoginStart }: Props) => {
  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    onLoginStart()
  }
  return (
    <form onSubmit={handleSubmit}>
      <Button
        type="submit"
        loading={state !== BankIdState.Idle && state !== BankIdState.Error}
        fullWidth={true}
      >
        <ButtonContent>
          <BankIdIcon color="white" />
          {title}
        </ButtonContent>
      </Button>
    </form>
  )
}

const ButtonContent = styled.span({
  display: 'inline-flex',
  gap: theme.space.xs,
})
