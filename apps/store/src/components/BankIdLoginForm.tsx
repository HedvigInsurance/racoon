import styled from '@emotion/styled'
import { FormEventHandler } from 'react'
import { BankIdIcon, Button, theme } from 'ui'
import { BankIdState } from '@/services/bankId/bankId.types'

type Props = {
  state: BankIdState
  title: string
  onLoginStart: () => void
}
export const BankIdLoginForm = ({ state, title, onLoginStart }: Props) => {
  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault()
    onLoginStart()
  }
  return (
    <form onSubmit={handleSubmit}>
      <BankIdButton
        type="submit"
        loading={state !== BankIdState.Idle && state !== BankIdState.Error}
      >
        <BankIdIcon color="white" />
        {title}
      </BankIdButton>
    </form>
  )
}

const BankIdButton = styled(Button)({
  gap: theme.space.xs,
})
