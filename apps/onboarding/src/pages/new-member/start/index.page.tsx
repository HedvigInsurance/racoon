import { Heading } from 'ui'
import type { NextPage } from 'next'
import { PageLayout } from './components/page-layout'
import { SsnInputForm } from './components/ssn-input-form'
import styled from '@emotion/styled'

type FormValue = {
  ssn: string
}

const Wrapper = styled.div({
  padding: '1rem',
  width: '100%',
  maxWidth: '50rem',
})

const Text = styled.p(({ theme }) => ({
  lineHeight: '1.5rem',
  fontSize: '1rem',
  color: theme.colors.gray700,
}))

const NewMemberStartPage: NextPage = () => {
  return (
    <PageLayout>
      <Wrapper>
        <Heading variant="s" headingLevel="h1" colorVariant="dark">
          Skaffa en snabbare, enklare och smidigare försäkring
        </Heading>
        <Text>
          Vi använder personnumret för att hämta uppgifter om ditt hem för att ge dig ett pris.
        </Text>
        <SsnInputForm />
      </Wrapper>
    </PageLayout>
  )
}

export default NewMemberStartPage
