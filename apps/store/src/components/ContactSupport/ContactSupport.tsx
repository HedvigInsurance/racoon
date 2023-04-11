import styled from '@emotion/styled'
import { Space, Text, theme, mq } from 'ui'
import { CustomerFirstScript, useCustomerFirst } from '@/services/CustomerFirst'
import { LinkField } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'
import { ContactCard, IconOptions } from './ContactCard'

export type ContactSupportProps = {
  chatTitle: string
  chatOpeningHours?: string
  phoneTitle: string
  phoneOpeningHours?: string
  phoneLink: LinkField
}

export const ContactSupport = ({
  chatTitle,
  chatOpeningHours,
  phoneTitle,
  phoneOpeningHours,
  phoneLink,
}: ContactSupportProps) => {
  const { show } = useCustomerFirst()

  return (
    <>
      <Main>
        <Space y={1.5}>
          <CardWrapper>
            <ChatButton onClick={show}>
              <ContactCard icon={IconOptions.Message}>
                <Text size={{ _: 'sm', md: 'md' }}>{chatTitle}</Text>
                {chatOpeningHours && (
                  <Text size={{ _: 'sm', md: 'md' }} color="textSecondary">
                    {chatOpeningHours}
                  </Text>
                )}
              </ContactCard>
            </ChatButton>
            <PhoneLink href={getLinkFieldURL(phoneLink)}>
              <ContactCard icon={IconOptions.NumberPad}>
                <Text size={{ _: 'sm', md: 'md' }}>{phoneTitle}</Text>
                {phoneOpeningHours && (
                  <Text size={{ _: 'sm', md: 'md' }} color="textSecondary">
                    {phoneOpeningHours}
                  </Text>
                )}
              </ContactCard>
            </PhoneLink>
          </CardWrapper>
        </Space>
      </Main>

      <CustomerFirstScript />
    </>
  )
}

const Main = styled.main({
  padding: theme.space.md,
  paddingTop: theme.space.lg,
  paddingBottom: theme.space.lg,
  textAlign: 'center',
})

const CardWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2,minmax(min-content, 13rem))',
  justifyContent: 'center',
  gap: theme.space.xs,

  [mq.sm]: {
    gap: theme.space.md,
  },
})

const PhoneLink = styled.a({})

const ChatButton = styled.button({ cursor: 'pointer' })
