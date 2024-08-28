import styled from '@emotion/styled'
import { MemberSearchForm } from 'portals/sos/features/member-search/MemberSearchForm'
import chroma from 'chroma-js'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;

  background-color: ${({ theme }) => theme.background};
`

const Content = styled.div`
  min-height: 90vh;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;

  height: 10vh;
  background-color: ${({ theme }) => theme.backgroundTransparent};

  a {
    text-decoration: underline;
    color: ${({ theme }) => chroma(theme.foreground).brighten(1).hex()};
    margin-top: 4vh;
    transition: color 200ms;

    :hover {
      color: ${({ theme }) => chroma(theme.foreground).brighten(2).hex()};
    }
  }
`

const MainPage = () => {
  return (
    <Container>
      <Content>
        <MemberSearchForm />
      </Content>
      <Footer>
        <a href="/login/logout">Sign out</a>
      </Footer>
    </Container>
  )
}

export default MainPage
