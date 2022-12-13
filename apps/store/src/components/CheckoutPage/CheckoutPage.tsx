import styled from '@emotion/styled'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Button, CrossIcon, Heading, Space } from 'ui'
import { PersonalNumberField } from '@/components/PersonalNumberField/PersonalNumberField'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Text } from '@/components/Text/Text'
import { TextField } from '@/components/TextField/TextField'
import { I18nNamespace } from '@/utils/l10n/types'
import { PageLink } from '@/utils/PageLink'
import { BankIdIcon } from './BankIdIcon'
import { FormElement } from './CheckoutPage.constants'
import { CheckoutPageProps } from './CheckoutPage.types'

const CheckoutPage = (props: CheckoutPageProps) => {
  const { cart, loading, prefilledData } = props
  const { t } = useTranslation(I18nNamespace.Checkout)

  return (
    <Space y={1}>
      <div>
        <Header>
          <Heading as="h1" variant="standard.24">
            {t('CHECKOUT_PAGE_HEADING')}
          </Heading>

          <Link href={PageLink.cart()}>
            <CrossIcon size="1.5rem" />
          </Link>
        </Header>

        <HorizontalLine />
      </div>

      <Section y={1}>
        <SpaceBetween>
          <SpaceFlex space={0.5} align="center">
            <StepIcon />
            <Text size="l">{t('CONTACT_DETAILS_FORM_TITLE')}</Text>
          </SpaceFlex>
          <Text size="l">{t('FORM_HELP_LABEL')}</Text>
        </SpaceBetween>

        <Space y={0.25}>
          <PersonalNumberField
            name={FormElement.PersonalNumber}
            label={t('FIELD_PERSONAL_NUMBER_SE_LABEL')}
            required
            defaultValue={prefilledData.personalNumber ?? undefined}
          />
          <TextField
            type="email"
            label={t('FORM_EMAIL_LABEL')}
            name={FormElement.Email}
            required
            defaultValue={prefilledData.email ?? undefined}
          />
          <Space y={0.5}>
            <Button fullWidth disabled={loading}>
              <SpaceFlex space={0.5}>
                <BankIdIcon />
                {t('SIGN_BUTTON', { count: cart.entries.length })}
              </SpaceFlex>
            </Button>
            <Text size="s" color="gray600" align="center">
              {t('SIGN_DISCLAIMER')}
            </Text>
          </Space>
        </Space>
      </Section>

      <HorizontalLine />
    </Space>
  )
}

const Section = styled(Space)(({ theme }) => ({
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
}))

const Header = styled(Section)({
  height: '3.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})
Header.defaultProps = { as: 'header' }

const HorizontalLine = styled.hr(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  height: 1,
  marginLeft: theme.space[4],
  marginRight: theme.space[4],
}))

const StepIcon = styled.div(({ theme }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  backgroundColor: theme.colors.gray900,
}))

const SpaceBetween = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space[4],
}))

export default CheckoutPage
