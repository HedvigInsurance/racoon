import styled from '@emotion/styled'
import { IntercomProvider, useIntercom } from 'react-use-intercom'
import { Heading, Button, Space } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

const getIntercomAppId = (): string => {
  const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID
  if (appId) return appId
  throw new Error('Expected env variable INTERCOM_APP_ID to be defined')
}

const IntercomChatButton = () => {
  const { show } = useIntercom()

  return (
    <FlexButton variant="outlined" onClick={show}>
      Chat with us
    </FlexButton>
  )
}

export type ContactSupportProps = {
  title: string
  showCallButton: boolean
  availabilityText?: string
}

export const ContactSupport = ({
  title,
  showCallButton,
  availabilityText,
}: ContactSupportProps) => {
  return (
    <Main>
      <Space y={1.5}>
        <Heading as="h2" color="dark" variant="standard.24">
          {title}
        </Heading>
        <AvatarImagePlaceholder />
        <Space y={1}>
          <SpaceFlex space={0.5} wrap="wrap">
            <IntercomProvider
              appId={getIntercomAppId()}
              autoBoot
              autoBootProps={{ hideDefaultLauncher: true }}
            >
              <IntercomChatButton />
            </IntercomProvider>
            {showCallButton && (
              <FlexButton variant="outlined" onClick={() => console.log('call')}>
                Schedule a call
              </FlexButton>
            )}
          </SpaceFlex>

          <AvailabilityText>{availabilityText}</AvailabilityText>
        </Space>
      </Space>
    </Main>
  )
}

const Main = styled.main(({ theme }) => ({
  backgroundColor: theme.colors.purple300,
  padding: theme.space[4],
  paddingTop: theme.space[5],
  paddingBottom: theme.space[5],
  textAlign: 'center',
}))

const AvatarImagePlaceholder = styled.div(({ theme }) => ({
  borderRadius: '100%',
  border: `2px solid ${theme.colors.black}`,
  backgroundColor: theme.colors.white,
  height: 48,
  width: 48,
  margin: '0 auto',
}))

const AvailabilityText = styled.p(({ theme }) => ({
  color: theme.colors.gray700,
  fontSize: theme.fontSizes[0],
}))

const FlexButton = styled(Button)({ flex: 1 })
