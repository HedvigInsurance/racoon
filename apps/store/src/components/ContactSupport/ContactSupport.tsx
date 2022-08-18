import styled from '@emotion/styled'
import { Heading, Button, Space } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

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
          <SpaceFlex space={0.5}>
            <FlexButton variant="outlined" onClick={() => console.log('chat')}>
              Chat with us
            </FlexButton>
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
