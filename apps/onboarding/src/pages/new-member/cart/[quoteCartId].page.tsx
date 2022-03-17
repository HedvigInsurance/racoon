import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import type { GetServerSideProps, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { mq } from 'ui'
import { HeroImage } from '@/components/hero-image'
import { PageHeaderLayout } from '@/components/page-header-layout'
import { getLocale } from '@/lib/l10n'
import { LocaleLabel } from '@/lib/l10n/locales'
import { createApolloClient } from '@/services/apollo'
import { QuoteCartDocument, QuoteCartQuery, QuoteCartQueryVariables } from '@/services/apollo/types'
import { Benefits } from './components/benefits'
import { ContactCard } from './components/contact-card'
import { Footer, FooterProps } from './components/footer'
import { InsuranceSelector, InsuranceSelectorOption } from './components/insurance-selector'
import { Intro, IntroProps } from './components/intro'
import { QuickForm, QuickFormProps } from './components/quick-form'
import { UpsellCard } from './components/upsell-card'
import { YourInformation } from './components/your-information'
import { getBundlePrice } from './selectors/get-bundle-price'
import { getInformationTable } from './selectors/get-information-table'
import { getInsuranceOptions } from './selectors/get-insurance-options'
import { getMainQuote } from './selectors/get-main-quote'
import { getQuickForm } from './selectors/get-quick-form'
import { getSelectedBundleVariant } from './selectors/get-selected-bundle-variant'
import { Table } from './types'

type Props = {
  intro: IntroProps
  footer: FooterProps
  yourInformation: Table
  quickForm: QuickFormProps
  insuranceOptions: Array<InsuranceSelectorOption>
}

const fadeInUp = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
})

const AnimateIn = styled.div({
  animation: `${fadeInUp} 0.5s ease-in-out`,
})

const Grid = styled.div({
  [mq.lg]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    height: '100vh',
  },
})

const Col = styled.div({
  [mq.lg]: {
    gridColumn: '2',
    width: '50vw',
    overflow: 'auto',
  },
})

const Content = styled.div({
  maxWidth: '600px',
  marginLeft: 'auto',
  marginRight: 'auto',
  [mq.lg]: {
    padding: '2rem 1rem',
  },
})

const NewMemberCartPage: NextPage<Props> = ({
  intro,
  footer,
  yourInformation,
  quickForm,
  insuranceOptions,
}) => {
  return (
    <AnimateIn>
      <PageHeaderLayout headerVariant="light">
        <Grid>
          <HeroImage
            mobileImgSrc="/racoon-assets/hero_mobile.jpg"
            desktopImgSrc="/racoon-assets/hero_desktop.jpg"
          />
          <Col>
            <Content>
              <Intro {...intro} />
              <YourInformation table={yourInformation} />
              <QuickForm {...quickForm} />
              <InsuranceSelector options={insuranceOptions} />
              <Benefits />
              <UpsellCard />
              <ContactCard />
            </Content>
            <Footer {...footer} />
          </Col>
        </Grid>
      </PageHeaderLayout>
    </AnimateIn>
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
    const insuranceOptions = getInsuranceOptions(data, selectedVariant)

    return {
      props: {
        intro: { street, price },
        yourInformation: getInformationTable(mainQuote),
        footer: { price, quoteCartId },
        quickForm: {
          quoteCartId,
          fields: getQuickForm(mainQuote),
        },
        insuranceOptions,

        ...(await serverSideTranslations(locale as string)),
      },
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default NewMemberCartPage
