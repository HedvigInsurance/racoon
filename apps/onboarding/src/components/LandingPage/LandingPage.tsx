import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useState, useMemo } from 'react'
import { mq, theme } from 'ui'
import { Button } from '@/components/Button/Button'
import { Header } from '@/components/Nav/Header'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'
import { Embark } from '@/services/embark'
import { Insurance } from '@/services/insurances'
import { InsuranceCard } from './InsuranceCard'

const FORM_ID = 'select-insurance-form'

export type LandingPageProps = {
  insurances: Array<Insurance>
  preSelectedInsurances: Array<Insurance['typeOfContract']>
  referer: string | null
}

export const LandingPage = ({ insurances, preSelectedInsurances }: LandingPageProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const locale = useCurrentLocale()

  const [formState, setFormState] = useState(() =>
    getFormInitialState(insurances, preSelectedInsurances),
  )
  const [isSubmiting, setIsSubmiting] = useState(false)

  const handleCardSelect = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const insuranceName = event.target.name

      setFormState((prevState) => ({
        ...prevState,
        [insuranceName]: !prevState[insuranceName],
      }))
    },
    [setFormState],
  )

  const hasSelectedAtLeastOneOption = useMemo(
    () => insurances.some((insurance) => formState[insurance.fieldName]),
    [formState, insurances],
  )

  return (
    <PageContainer>
      <Header />

      <Main>
        <Heading>{t('LANDING_PAGE_HEADLINE')}</Heading>
        <form
          id={FORM_ID}
          noValidate
          onSubmit={(event) => {
            event.preventDefault()
            const form = event.currentTarget

            const hasNoneSelected = !Object.values(formState).some(Boolean)
            const firstCheckbox = form.elements.namedItem(
              insurances[0].fieldName,
            ) as HTMLInputElement
            firstCheckbox.setCustomValidity(
              hasNoneSelected ? t('LANDING_PAGE_MISSING_MAIN_COVERAGE_ERROR') : '',
            )
            const isFormValid = form.reportValidity()

            if (isFormValid) {
              setIsSubmiting(true)
              Embark.setStore(locale.market, formState)
              const slug = Embark.getSlug(locale.market)
              router.push(PageLink.embark({ locale: locale.path, slug }))
            }
          }}
        >
          <InsuranceCardGrid>
            {insurances.map(({ id, name, description, img, perils, fieldName }) => {
              return (
                <li key={id}>
                  <InsuranceCard
                    title={t(name)}
                    description={t(description)}
                    img={img}
                    perils={perils}
                    name={fieldName}
                    checked={formState[fieldName]}
                    onChange={handleCardSelect}
                    required={!hasSelectedAtLeastOneOption}
                  />
                </li>
              )
            })}
          </InsuranceCardGrid>
        </form>
      </Main>
      <FooterButton form={FORM_ID} color="dark" disabled={isSubmiting}>
        {t('START_SCREEN_SUBMIT_BUTTON')}
      </FooterButton>
    </PageContainer>
  )
}

const getFormInitialState = (
  insurances: Array<Insurance>,
  preselectedInsurance: Array<Insurance['typeOfContract']>,
) => {
  return insurances.reduce<Record<string, boolean>>(
    (result, insurance) => ({
      ...result,
      [insurance.fieldName]: preselectedInsurance.includes(insurance.typeOfContract),
    }),
    {},
  )
}

const Main = styled.div({
  padding: '0 1rem',
  paddingBottom: '2rem',
  margin: 'auto',
  maxWidth: '53rem',
  marginTop: 0,
})

const Heading = styled.h1(({ theme }) => ({
  fontSize: theme.fontSizes[5],
  textAlign: 'center',
  marginBlock: `${theme.space[4]} ${theme.space[5]}`,
  [mq.sm]: {
    fontSize: theme.fontSizes[6],
    marginBlock: `${theme.space[5]} ${theme.space[7]}`,
  },
}))

const InsuranceCardGrid = styled.ul(() => ({
  display: 'grid',
  gap: theme.space[3],
  gridTemplateColumns: '1fr 1fr',
  [mq.sm]: {
    gap: theme.space[5],
  },
}))

const PageContainer = styled.main((props) => ({
  backgroundColor: props.theme.colors.gray100,
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  isolation: 'isolate',
  [mq.sm]: {
    display: 'block',
  },
}))

const FooterButton = styled(Button)(({ theme }) => ({
  position: 'sticky',
  bottom: theme.space[5],
  marginTop: theme.space[5],
  marginInline: theme.space[4],
  [mq.sm]: {
    left: '50%',
    bottom: theme.space[6],
    transform: 'translateX(-50%)',
  },
}))
