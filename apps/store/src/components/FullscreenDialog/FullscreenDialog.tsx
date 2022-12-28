import styled from '@emotion/styled'
import { CrossIcon, Dialog, mq } from 'ui'

type Props = {
  children: React.ReactNode
  Footer: React.ReactNode
}

export const Modal = ({ children, Footer }: Props) => {
  return (
    <Content frostedOverlay={true}>
      <Header>
        <CloseButton>
          <CrossIcon size="1.5rem" />
        </CloseButton>
      </Header>
      <Main>{children}</Main>
      <FooterWrapper>{Footer}</FooterWrapper>
    </Content>
  )
}

const Content = styled(Dialog.Content)(({ theme }) => ({
  height: '100%',
  paddingLeft: theme.space[4],
  paddingRight: theme.space[4],
  paddingBottom: theme.space[4],
  display: 'grid',
  gridTemplateRows: '3rem 1fr auto',

  [mq.lg]: {
    paddingBottom: theme.space[7],
  },
}))

const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
})

const CloseButton = styled(Dialog.Close)({
  cursor: 'pointer',
})

const Main = styled.main({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

const FooterWrapper = styled.footer(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 24rem)',
  justifyContent: 'center',
  gap: theme.space[1],
}))

export const Root = Dialog.Root
export const Close = Dialog.Close
