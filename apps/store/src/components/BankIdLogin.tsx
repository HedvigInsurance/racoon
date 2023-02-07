import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { BankIdIcon, Button, Text, theme } from 'ui'
import { BankIdState, useBankIdLogin } from '@/services/bankId'

type Props = {
  shopSessionId: string
  ssn: string
  onCompleted: () => void
}

// TODO: To be replaced with new UI when login is removed from cart page
export const BankIdLogin = ({ shopSessionId, ssn, onCompleted }: Props) => {
  const { t } = useTranslation('common')
  const [startLogin, loginState] = useBankIdLogin({ shopSessionId, ssn, onCompleted })
  return (
    <>
      <BankIdLoginForm
        title={t('LOGIN_BUTTON_TEXT')}
        state={loginState}
        onLoginStart={startLogin}
      />
      {loginState === BankIdState.Pending && <Text>Pleas open BankID app now</Text>}
      {loginState === BankIdState.Success && <Text>Login success</Text>}
      {loginState === BankIdState.Error && <Text>Something went wrong</Text>}
    </>
  )
}

type BankIdLoginProps = {
  state: BankIdState
  title: string
  onLoginStart: () => void
}
export const BankIdLoginForm = ({ state, title, onLoginStart }: BankIdLoginProps) => {
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
