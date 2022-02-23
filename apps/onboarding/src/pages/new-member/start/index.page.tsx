import { Heading, LinkButton, Space, mq } from 'ui'

import type { NextPage } from 'next'
import { PageLayout } from './components/page-layout'
import { SsnInputForm } from './components/ssn-input-form'
import styled from '@emotion/styled'

const PageWrapper = styled.div({
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})
const InnerWrapper = styled.div({
  padding: '6rem 1rem',
  width: '100%',
  maxWidth: '30rem',
  [mq.lg]: {
    paddingTop: '8rem',
  },
})
const Text = styled.p(({ theme }) => ({
  lineHeight: '1.5rem',
  fontSize: '1rem',
  color: theme.colors.gray700,
  margin: 0,
}))

const NewMemberStartPage: NextPage = () => {
  return (
    <PageLayout>
      <PageWrapper>
        <InnerWrapper>
          <Space y={1}>
            <Heading variant="s" headingLevel="h1" colorVariant="dark">
              Skaffa en snabbare, enklare och smidigare försäkring
            </Heading>
            <Text>
              Vi använder personnumret för att hämta uppgifter om ditt hem för att ge dig ett pris.
            </Text>
            <SsnInputForm />
            <LinkButton
              href="https://www.hedvig.com/se-en/new-member/new/insurance-type"
              $variant="text"
            >
              {'Eller fyll i manuellt >'}
            </LinkButton>
          </Space>
        </InnerWrapper>
      </PageWrapper>
    </PageLayout>
  )
}

export default NewMemberStartPage
