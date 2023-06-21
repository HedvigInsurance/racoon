import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { type FormEventHandler } from 'react'
import { Button, HedvigLogo, Space, mq, theme } from 'ui'
import { ContractCard } from '@/components/ConfirmationPage/ContractCard'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { MENU_BAR_HEIGHT_DESKTOP, MENU_BAR_HEIGHT_MOBILE } from '@/components/Header/HeaderStyles'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { BankIdState } from '@/services/bankId/bankId.types'
import { useBankIdContext } from '@/services/bankId/BankIdContext'
import { PageLink } from '@/utils/PageLink'

const SSN_FIELD_NAME = 'ssn'

type Props = { contractId: string; ssn?: string }

export const InitiateCarCancellationPage = (props: Props) => {
  const { t } = useTranslation(['common', 'purchase-form'])
  const { startLogin, currentOperation } = useBankIdContext()
  const isAuth = currentOperation?.state === BankIdState.Success

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const ssn = formData.get(SSN_FIELD_NAME)
    if (typeof ssn !== 'string') return

    startLogin({ ssn })
  }

  return (
    <Space y={2}>
      <Header>
        <Link href={PageLink.home()}>
          <HedvigLogo width={78} />
        </Link>
      </Header>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          {isAuth ? (
            // TODO: Replace with real data
            <ContractCard
              id={props.contractId}
              displayName={'Bilförsäkring · If'}
              status={{ type: 'PENDING', message: 'Pending' }}
              approveByDate={'2021-01-01'}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              <PersonalNumberField
                name={SSN_FIELD_NAME}
                label={t('FIELD_SSN_SE_LABEL', { ns: 'purchase-form' })}
                required={true}
                defaultValue={props.ssn}
              />
              <Button type="submit">{t('LOGIN_BUTTON_TEXT')}</Button>
            </form>
          )}
        </GridLayout.Content>
      </GridLayout.Root>
    </Space>
  )
}

const Header = styled(GridLayout.Root)({
  paddingInline: theme.space.md,
  display: 'flex',
  alignItems: 'center',
  height: MENU_BAR_HEIGHT_MOBILE,

  [mq.md]: {
    paddingInline: theme.space.xl,
    gridTemplateRows: MENU_BAR_HEIGHT_DESKTOP,
  },
})
