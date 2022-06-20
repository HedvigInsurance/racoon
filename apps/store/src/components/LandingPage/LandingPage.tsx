import styled from '@emotion/styled'
import Link from 'next/link'
import { ArrowForwardIcon, Heading, LinkButton } from 'ui'
import { useCurrentLocale } from '@/lib/l10n/useCurrentLocale'
import { PageLink } from '@/lib/PageLink'

const Wrapper = styled.main({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const LandingPage = () => {
  return (
    <Wrapper>
      <Heading headingLevel="h1" variant="xl" colorVariant="dark">
        Landing Page
      </Heading>
      <Link href={PageLink.store()} passHref>
        <a>
          Go to shop <ArrowForwardIcon />
        </a>
      </Link>
    </Wrapper>
  )
}
