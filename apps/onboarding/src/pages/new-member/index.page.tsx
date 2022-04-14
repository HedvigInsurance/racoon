import styled from '@emotion/styled'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Button, Heading, mq } from 'ui'
import { BodyText } from '@/components/BodyText'
import { Header } from '@/components/Nav/Header'
import { ResponsiveFooter } from '@/components/Nav/ResponsiveFooter'
import { AdditionalCoverageCard } from '@/components/new-member/coverage-cards/additional'
import { MainCoverageCard } from '@/components/new-member/coverage-cards/main'
import {
  getInsurancesByLocaleLabel,
  getMainCoverageInsurances,
  getAdditionalCoverageInsurances,
  getFormInitialState,
} from '@/components/new-member/new-member.helpers'
import { Insurances } from '@/components/new-member/new-member.types'
import { useCurrentLocale } from '@/lib/l10n'
import { LocaleLabel } from '@/lib/l10n/locales'
import { PageLink } from '@/lib/page-link'
import { Embark } from '@/services/embark'

const CardGrid = styled.div({
  display: 'grid',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 1rem',
  margin: 'auto',
  gap: 6,
  maxWidth: '53rem',
  gridAutoColumns: '1fr 1fr',
  marginBottom: 'auto',
  marginTop: 0,
  paddingBottom: '2rem',
  [mq.sm]: {
    paddingBottom: 0,
  },
})

const TitleContainer = styled.div({
  gridColumn: '1 / span 2',
  marginBottom: '1rem',
  marginTop: '1.5rem',
  [mq.sm]: {
    marginTop: '3rem',
  },
})

const PageContainer = styled.main((props) => ({
  backgroundColor: props.theme.colors.gray100,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
}))

const FooterButton = styled(Button)({
  width: '100%',
  textAlign: 'center',
  [mq.sm]: {
    width: 'auto',
    marginTop: '5rem',
    marginBottom: '3.5rem',
  },
})

const ContentCard = styled.div({
  gridColumn: '1 / span 2',
  textAlign: 'start',
  margin: '1rem 1rem 0 0',
  [mq.sm]: { margin: '0 8rem', marginTop: '3.5rem', textAlign: 'center' },
})

type GridCardProps = { size: 'half' | 'full' }

const GridMainCoverageCard = styled(MainCoverageCard)<GridCardProps>((props) => ({
  gridColumn: '1 / span 2',
  [mq.sm]: { gridColumn: props.size === 'half' ? 'span 1' : '1 / span 2' },
}))
const GridAdditionalCoverageCard = styled(AdditionalCoverageCard)({ gridArea: 'span 1' })

type NewMemberPageProps = {
  mainCoverageInsurances: Insurances
  additionalCoverageInsurances: Insurances
  formInitialState: Record<string, boolean>
}

const NewMemberPage: NextPage<NewMemberPageProps> = ({
  mainCoverageInsurances,
  additionalCoverageInsurances,
  formInitialState,
}) => {
  const { t } = useTranslation()
  const locale = useCurrentLocale()
  const router = useRouter()

  const [formState, setFormState] = useState(formInitialState)
  const [isRedirecting, setIsRedirecting] = useState(false)

  return (
    <PageContainer>
      <Header />
      <form
        onSubmit={(event) => {
          event.preventDefault()

          setIsRedirecting(true)
          Embark.setStore(locale, formState)
          const slug = Embark.getSlug(locale)
          router.push(PageLink.embark({ locale: locale.path, slug }))
        }}
      >
        <CardGrid>
          <ContentCard>
            <Heading variant="m" headingLevel="h2" colorVariant="dark">
              {t('LANDING_PAGE_HEADLINE')}
            </Heading>
            <BodyText variant={1} colorVariant="medium" displayBlock>
              {t('LANDING_PAGE_SUBHEADING')}
            </BodyText>
          </ContentCard>
          <TitleContainer>
            <Heading variant="xs" colorVariant="dark" headingLevel="h3">
              {t('LANDING_PAGE_SECTION_TITLE_MAIN')}
            </Heading>
          </TitleContainer>

          {mainCoverageInsurances.map(({ id, name, description, img, fieldName }, index, arr) => {
            const isLastItem = index === arr.length - 1
            const cardSize = isLastItem && index % 2 === 0 ? 'full' : 'half'
            const isSingleCard = arr.length === 1
            return (
              <GridMainCoverageCard
                key={id}
                selected={formState[fieldName]}
                onCheck={
                  !isSingleCard
                    ? () =>
                        setFormState((prevState) => ({
                          ...prevState,
                          [fieldName]: !prevState[fieldName],
                        }))
                    : undefined
                }
                cardImg={img}
                title={t(name)}
                description={t(description)}
                size={cardSize}
              />
            )
          })}
          <TitleContainer>
            <Heading variant="xs" colorVariant="dark" headingLevel="h3">
              {t('LANDING_PAGE_SECTION_TITLE_ADDITIONAL')}
            </Heading>
          </TitleContainer>
          {additionalCoverageInsurances.map(({ id, name, description, img, fieldName }) => (
            <GridAdditionalCoverageCard
              key={id}
              enableHover
              cardImg={img}
              selected={formState[fieldName]}
              onCheck={() =>
                setFormState((prevState) => ({
                  ...prevState,
                  [fieldName]: !prevState[fieldName],
                }))
              }
              title={t(name)}
              description={t(description)}
            />
          ))}
        </CardGrid>
        <ResponsiveFooter>
          <FooterButton type="submit" color="dark" disabled={isRedirecting}>
            {t('START_SCREEN_SUBMIT_BUTTON')}
          </FooterButton>
        </ResponsiveFooter>
      </form>
    </PageContainer>
  )
}

export const getStaticProps: GetStaticProps<NewMemberPageProps> = async (context) => {
  // Skips prerendering this page for 'default' locale
  // https://nextjs.org/docs/advanced-features/i18n-routing#non-dynamic-getstaticprops-pages
  if (context.locale === 'default') {
    return { notFound: true }
  }

  const locale = context.locale as LocaleLabel
  const insurances = getInsurancesByLocaleLabel(locale)

  if (insurances.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale)),
      mainCoverageInsurances: getMainCoverageInsurances(insurances),
      additionalCoverageInsurances: getAdditionalCoverageInsurances(insurances),
      formInitialState: getFormInitialState(insurances),
    },
  }
}

export default NewMemberPage
