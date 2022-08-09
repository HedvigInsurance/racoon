import styled from '@emotion/styled'
import { Heading, Button, Space, useBreakpoint } from 'ui'

const Main = styled.main(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.colors.purple500,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: '1.5rem 0',
  textAlign: 'center',
}))

const AvailabilityText = styled.p(({ theme }) => ({
  color: theme.colors.gray600,
  fontSize: '0.75rem',
  textAlign: 'center',
  marginTop: '1rem',
}))

export const SupportBlock = () => {
  const isLargeScreen = useBreakpoint('xs')
  return (
    <Main>
      <Space y={1.5}>
        <Heading as="h2" color="dark" variant="standard.24">
          Need help? Ask a specialist.
        </Heading>
        <Space x={0.5}>
          <Button
            size={!isLargeScreen ? 'sm' : 'lg'}
            variant="outlined"
            onClick={() => console.log('chat')}
          >
            Chat with us
          </Button>
          <Button
            size={!isLargeScreen ? 'sm' : 'lg'}
            variant="outlined"
            onClick={() => console.log('call')}
          >
            Schedule a call
          </Button>
        </Space>
      </Space>
      <AvailabilityText>Peter is available today 9-18.</AvailabilityText>
    </Main>
  )
}
