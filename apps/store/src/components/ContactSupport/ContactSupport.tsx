import styled from '@emotion/styled'
import { Heading, Button, Space, useBreakpoint } from 'ui'

export type ContactSupportProps = {
  title: string
  showCallButton: boolean
  availabilityText?: string
}

const Main = styled.main(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.purple500,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '1.5rem 0',
  textAlign: 'center',
}))

const AvatarImagePlaceholder = styled.div(({ theme }) => ({
  borderRadius: '100%',
  border: `1px solid ${theme.colors.black}`,
  height: '48px',
  width: '48px',
  margin: '0 auto',
}))

const AvailabilityText = styled.p(({ theme }) => ({
  color: theme.colors.gray600,
  fontSize: '0.75rem',
  textAlign: 'center',
  marginTop: '1rem',
}))

export const ContactSupport = ({
  title,
  showCallButton,
  availabilityText,
}: ContactSupportProps) => {
  const isLargeScreen = useBreakpoint('xs')
  return (
    <Main>
      <Space y={1.5}>
        <Heading as="h2" color="dark" variant="standard.24">
          {title}
        </Heading>
        <AvatarImagePlaceholder />
        <Space x={0.5}>
          <Button
            size={!isLargeScreen ? 'sm' : 'lg'}
            variant="outlined"
            onClick={() => console.log('chat')}
          >
            Chat with us
          </Button>
          {showCallButton && (
            <Button
              size={!isLargeScreen ? 'sm' : 'lg'}
              variant="outlined"
              onClick={() => console.log('call')}
            >
              Schedule a call
            </Button>
          )}
        </Space>
      </Space>
      <AvailabilityText>{availabilityText}</AvailabilityText>
    </Main>
  )
}
