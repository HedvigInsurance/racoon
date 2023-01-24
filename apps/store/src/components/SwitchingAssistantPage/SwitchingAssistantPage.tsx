import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { CheckoutHeader } from '@/components/CheckoutHeader/CheckoutHeader'
import { ShopSession } from '@/services/shopSession/ShopSession.types'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { PageLink } from '@/utils/PageLink'
import { useFormatter } from '@/utils/useFormatter'

type Props = { shopSession: ShopSession }

type CancellableEntry = { key: string; name: string; company: string; url: string; date: Date }

export const SwitchingAssistantPage = ({ shopSession }: Props) => {
  const { routingLocale } = useCurrentLocale()
  const { t } = useTranslation('checkout')
  const formatter = useFormatter()
  const entriesToCancel = shopSession.cart.entries.reduce<Array<CancellableEntry>>(
    (entries, entry) => {
      if (entry.cancellation.bankSigneringUrl) {
        entries.push({
          key: entry.id,
          name: entry.variant.product.displayNameFull,
          // TODO: get from API
          company: 'Company name',
          url: entry.cancellation.bankSigneringUrl,
          // TODO: get from API
          date: new Date(),
        })
      }
      return entries
    },
    [],
  )

  return (
    <Space y={{ base: 1, lg: 2.5 }}>
      <Header>
        <CheckoutHeader activeStep="switching-assistant">
          <TextLink href={PageLink.customerService({ locale: routingLocale })}>
            <Text>{t('SWITCHING_ASSISTANT_SUPPORT_LINK')}</Text>
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
              {entriesToCancel.map((item) => (
                <Card key={item.key}>
                  <Space y={1}>
                    <Pill>
                      <PillStatus />
                      <Text size="xs">
                        {t('SWITCHING_ASSISTANT_BANK_SIGNERING_STATUS_PENDING')}
                      </Text>
                    </Pill>
                    <Space y={1}>
                      <div>
                        <Text>
                          {item.name} · {item.company}
                        </Text>
                        <Text color="textSecondary">
                          {t('SWITCHING_ASSISTANT_BANK_SIGNERING_MESSAGE', {
                            date: formatter.fromNow(item.date),
                          })}
                        </Text>
                      </div>
                      <ButtonNextLink href={item.url}>
                        {t('SWITCHING_ASSISTANT_BANK_SIGNERING_LINK')}
                      </ButtonNextLink>
                    </Space>
                  </Space>
                </Card>
              ))}
            </Space>
            <Footer>
              <ButtonNextLink
                variant="ghost"
                href={PageLink.confirmation({ shopSessionId: shopSession.id })}
              >
                {t('SWITCHING_ASSISTANT_SKIP_LINK')}
              </ButtonNextLink>
            </Footer>
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

  ':focus-visible': {
    borderRadius: theme.radius.xs,
    boxShadow: `${theme.colors.light} 0 0 0 3px, ${theme.colors.textPrimary} 0 0 0 4px`,
  },
})

const Main = styled.main({
  paddingInline: theme.space.xs,
})

const Card = styled.div({
  padding: theme.space.md,
  backgroundColor: theme.colors.gray100,
  borderRadius: theme.radius.md,
})

const Pill = styled.div({
  backgroundColor: theme.colors.light,
  borderRadius: theme.radius.xs,
  paddingInline: theme.space.xs,
  paddingBlock: theme.space.xxs,
  display: 'inline-flex',
  gap: theme.space.xxs,
  alignItems: 'center',
})

const PillStatus = styled.div({
  height: theme.space.xs,
  width: theme.space.xs,
  borderRadius: '50%',
  // TODO: use theme color: Amber 600
  backgroundColor: '#FFBF00',
})

const Footer = styled.footer({
  paddingInline: theme.space.md,
})
