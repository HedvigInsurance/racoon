import { Button, theme } from 'ui'

import AccidentImg from '../../assets/accident.jpg'
import { Arrow } from './icons/arrow'
import Image from 'next/image'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  padding: '0.75rem 1rem',
})

const Card = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.white,
  borderColor: theme.colors.gray300,
  boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.05)',
  borderRadius: '0.625rem',
  overflow: 'hidden',
}))

const Header = styled.div({})

const Content = styled.div({
  padding: '1rem 1.5rem 1.5rem',
})

const Title = styled.p({
  marginTop: 0,
  marginBottom: '0.75rem',
})

const List = styled.ul({
  marginTop: 0,
  marginBottom: '1rem',
  padding: 0,
  fontSize: '0.875rem',
  listStyle: 'none',
})

const Item = styled.li({
  listStyle: 'none',
  lineHeight: 1.5,
  color: theme.colors.gray800,
})

const Footer = styled.div({
  display: 'flex',
})

export const UpsellCard = () => (
  <Wrapper>
    <p>Get more coverage</p>
    <Card>
      <Header>
        <Image src={AccidentImg} alt="Accident image" />
      </Header>
      <Content>
        <Title>Accident insurance</Title>
        <List>
          <Item>
            <Arrow /> Covers all co-insured
          </Item>
          <Item>
            <Arrow /> For all accidents, big and small
          </Item>
          <Item>
            <Arrow /> No deductible
          </Item>
        </List>
        <Footer>
          <Button $variant="outlined" $size="sm">Add</Button>
        </Footer>
      </Content>
    </Card>
  </Wrapper>
)
