import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Heading, mq, Space, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { CheckoutStep } from '@/components/CheckoutHeader/Breadcrumbs'
import { CheckoutHeader } from '@/components/CheckoutHeader/CheckoutHeader'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { CardSkeleton, ContractCard } from './ContractCard'
import { useSwitchingContracts } from './useSwitchingContracts'

export type SwitchingAssistantPageProps = {
  checkoutSteps: Array<CheckoutStep>
  shopSessionId: string
}

export const SwitchingAssistantPage = (props: SwitchingAssistantPageProps) => {
  const { checkoutSteps, shopSessionId } = props
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('checkout')
  const switchingContracts = useSwitchingContracts({ shopSessionId })

  const loadingContracts = switchingContracts.length === 0
  const allCompleted =
    !loadingContracts && switchingContracts.every((item) => item.status.type === 'COMPLETED')

  const nextLink = PageLink.confirmation({ shopSessionId })
  const nextButton = allCompleted ? (
    <ButtonNextLink href={nextLink}>{t('SWITCHING_ASSISTANT_NEXT_LINK')}</ButtonNextLink>
  ) : (
    <ButtonNextLink variant="ghost" href={nextLink}>
      {t('SWITCHING_ASSISTANT_SKIP_LINK')}
    </ButtonNextLink>
  )

  return (
    <Space y={{ base: 1, lg: 2.5 }}>
      <Header>
        <CheckoutHeader steps={checkoutSteps} activeStep={CheckoutStep.SwitchingAssistant}>
          <TextLink
            href={PageLink.customerService({ locale: routingLocale })}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('SWITCHING_ASSISTANT_SUPPORT_LINK')}
          </TextLink>
        </CheckoutHeader>
      </Header>
      <Wrapper y={{ base: 2, lg: 3.5 }}>
        <Heading as="h1" variant="standard.24" align="center">
          {t('SWITCHING_ASSISTANT_TITLE')}
        </Heading>
        <Main>
          <Space y={1.5}>
            <Space y={0.25}>
              {loadingContracts ? <CardSkeleton /> : switchingContracts.map(ContractCard)}
            </Space>
            <Footer>{nextButton}</Footer>
          </Space>
        </Main>
      </Wrapper>
    </Space>
  )
}

const Wrapper = styled(Space)({
  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})

const Header = styled.header({
  paddingInline: theme.space.md,
})

const TextLink = styled(Link)({
  backgroundColor: theme.colors.light,
  fontSize: theme.fontSizes.md,

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },
})

const Main = styled.main({
  paddingInline: theme.space.xs,
})

const Footer = styled.footer({
  paddingInline: theme.space.md,
})
