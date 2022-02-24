import { Footer, FooterProps } from './components/footer'
import type { GetServerSideProps, NextPage } from 'next'
import { Intro, IntroProps } from './components/intro'
import { QuickForm, QuickFormProps } from './components/quick-form'
import { QuoteCartDocument, QuoteCartQuery, QuoteCartQueryVariables } from '@/services/apollo/types'

import { Benefits } from './components/benefits'
import { ContactCard } from './components/contact-card'
import { Hero } from './components/hero'
import { LocaleLabel } from '@/lib/l10n/locales'
import { PageLayout } from '../start/components/page-layout'
import { Table } from './types'
import { YourInformation } from './components/your-information'
import { createApolloClient } from '@/services/apollo'
import { getBundlePrice } from './selectors/get-bundle-price'
import { getInformationTable } from './selectors/get-information-table'
import { getLocale } from '@/lib/l10n'
import { getMainQuote } from './selectors/get-main-quote'
import { getQuickForm } from './selectors/get-quick-form'
import { getSelectedBundleVariant } from './selectors/get-selected-bundle-variant'
import { mq } from 'ui'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styled from '@emotion/styled'

type Props = {
  intro: IntroProps
  footer: FooterProps
  yourInformation: Table
  quickForm: QuickFormProps
}

const Grid = styled.div({
  [mq.md]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: '100vh',
  },
})

const Col = styled.div({
  [mq.md]: {
    gridColumn: '2',
    width: '50vw',
    overflow: 'auto',
  },
})

const Content = styled.div({
  [mq.md]: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '2rem 1rem',
  },
})

const NewMemberCartPage: NextPage<Props> = ({ intro, footer, yourInformation, quickForm }) => {
  return (
    <PageLayout headerVariant="light">
      <Grid>
        <Hero
          mobileImgSrc="/racoon-assets/hero_mobile.jpg"
          desktopImgSrc="/racoon-assets/hero_desktop.jpg"
        />
        <Col>
          <Content>
            <Intro {...intro} />
            <YourInformation table={yourInformation} />
            <Benefits />
            <QuickForm {...quickForm} />
            <ContactCard />
          </Content>
          <Footer {...footer} />
        </Col>
      </Grid>
    </PageLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, locale }) => {
  const quoteCartId = query.quoteCartId as string
  const selectedInsuranceTypes = (query.type || []) as string[]
  const currentLocale = getLocale(locale as LocaleLabel)
  const client = createApolloClient()

  try {
    const { data } = await client.query<QuoteCartQuery, QuoteCartQueryVariables>({
      query: QuoteCartDocument,
      variables: { id: quoteCartId, locale: currentLocale.isoLocale },
    })

    const selectedVariant = getSelectedBundleVariant(data, selectedInsuranceTypes)
    const mainQuote = getMainQuote(selectedVariant)
    const price = getBundlePrice(selectedVariant)
    const street = mainQuote.data.street

    return {
      props: {
        intro: { street, price },
        yourInformation: getInformationTable(mainQuote),
        footer: { price, quoteCartId },
        quickForm: {
          quoteCartId,
          fields: getQuickForm(mainQuote),
        },

        ...(await serverSideTranslations(locale as string)),
      },
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default NewMemberCartPage
