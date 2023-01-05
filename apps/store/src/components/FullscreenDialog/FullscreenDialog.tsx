import styled from '@emotion/styled'
import { CrossIcon, Dialog, mq } from 'ui'

type Props = {
  children: React.ReactNode
  Footer: React.ReactNode
  center?: boolean
}

export const Modal = ({ children, Footer, center = false }: Props) => {
  return (
    <Content frostedOverlay={true}>
      <Header>
        <CloseButton>
          <CrossIcon size="1.5rem" />
        </CloseButton>
      </Header>
      {center ? (
        <CenteredMain>{children}</CenteredMain>
      ) : (
        <Main>
          <ClearHeader />
          {children}
          <ClearFooter />
        </Main>
      )}
      <FooterWrapper>{Footer}</FooterWrapper>
    </Content>
  )
}

const Content = styled(Dialog.Content)({
  height: '100%',
  overflowY: 'auto',
})

const HEADER_HEIGHT = '3.5rem'
const Header = styled.header(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingInline: theme.space.md,
  height: HEADER_HEIGHT,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,

  [mq.lg]: {
    paddingInline: theme.space.xl,
  },
}))

const CloseButton = styled(Dialog.Close)({ cursor: 'pointer' })

const Main = styled.main({
  height: '100%',
})

const CenteredMain = styled(Main)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingInline: theme.space.md,
}))

const ClearHeader = styled.div({
  height: HEADER_HEIGHT,
})

const BUTTON_HEIGHT = '3.25rem'
const ClearFooter = styled.div(({ theme }) => ({
  height: `calc(${BUTTON_HEIGHT} + ${theme.space.md} * 2)`,
  [mq.lg]: {
    height: `calc(${BUTTON_HEIGHT} + ${theme.space.xxl} * 2)`,
  },
}))

const FooterWrapper = styled.footer(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,

  display: 'grid',
  gridTemplateColumns: 'minmax(0, 24rem)',
  justifyContent: 'center',
  gap: theme.space[1],
  paddingInline: theme.space.md,
  paddingBottom: theme.space.md,

  [mq.lg]: {
    paddingBottom: theme.space.xxl,
  },
}))

export const Root = Dialog.Root
export const Close = Dialog.Close
