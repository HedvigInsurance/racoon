import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'framer-motion'
import type { GetStaticProps, NextPage } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { Button, Heading, Space, mq } from 'ui'
import { HeroImage } from '@/components/hero-image'
import { PageHeaderLayout } from '@/components/page-header-layout'
import { useForm } from '@/hooks/use-form'
import { useCurrentLocale } from '@/lib/l10n'
import { Bullet, BulletList } from './components/bullet-list'
import { InputFieldWithHint } from './components/InputFieldWithHint'
import { LoadingState } from './components/loading-state'
import { RadioGroupItem } from './components/radio-group-item'
import { EntryPoint, EntryPointField, LocaleField, PersonalNumberField } from './shared'

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

const Content = styled(Space)({
  '--padding-x': '1rem',
  padding: 'var(--padding-x)',
  width: '100%',
  maxWidth: 'calc(30rem + var(--padding-x) * 2)',
  margin: '0 auto',
  boxSizing: 'border-box',

  [mq.md]: {
    minHeight: 'initial',
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },

  [mq.lg]: {
    '--padding-x': '2rem',
  },

  [mq.xl]: {
    paddingTop: '6rem',
  },
})

const SubHeading = styled.p(({ theme }) => ({
  lineHeight: '1.5rem',
  fontSize: '1rem',
  color: theme.colors.gray700,
  margin: 0,
  display: 'none',

  [mq.lg]: {
    display: 'block',
  },
}))

const HighlightBlock = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray200,
  padding: '1rem',
  borderRadius: '0.25rem',
}))

const CaptionText = styled.p(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.gray500,
  fontSize: '0.875rem',
  textAlign: 'center',
  maxWidth: '20rem',
  margin: '0 auto',
}))

const CaptionLink = styled.a(() => ({
  textDecoration: 'underline',
}))

const StickyFooter = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.colors.white,
  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05), 0px -8px 16px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  justifyContent: 'stretch',

  [mq.lg]: {
    position: 'static',
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
}))

const FooterContent = styled.div({
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
  padding: '1rem',
  paddingBottom: '2rem',

  [mq.lg]: {
    padding: 0,
  },
})

const Spacer = styled.div({
  height: '6rem',
})

const Overlay = styled(motion.div)(() => ({
  position: 'fixed',
  zIndex: 9999,
  inset: 0,
  display: 'none',
}))

Overlay.defaultProps = {
  variants: {
    visible: {
      opacity: 1,
      display: 'block',
    },
    hidden: {
      opacity: 0,
      transitionEnd: {
        display: 'none',
      },
    },
  },
}

const NewMemberStartPage: NextPage = () => {
  const { path } = useCurrentLocale()
  const form = useForm({ action: '/api/pages/start' })
  const [entryPoint, setEntryPoint] = useState<EntryPoint>()
  const { t } = useTranslation()

  const personalNumberError = form.errors?.[PersonalNumberField]
  const showLoader = form.state === 'submitting' && entryPoint === EntryPoint.Current

  return (
    <>
      <PageHeaderLayout headerVariant="light">
        <form {...form.formProps}>
          <Grid>
            <HeroImage
              mobileImgSrc="/racoon-assets/hero_start_mobile.jpg"
              desktopImgSrc="/racoon-assets/hero_start_desktop.jpg"
            />
            <Col>
              <Content y={2}>
                <Space y={1}>
                  <Heading variant="s" headingLevel="h1" colorVariant="dark">
                    Få prisförslag, jämför och byt
                  </Heading>

                  <SubHeading>
                    Vi behöver lite information för att ge dig ett prisförslag.
                  </SubHeading>
                </Space>

                <RadioGroup.Root
                  name={EntryPointField}
                  value={entryPoint}
                  onValueChange={(value) => setEntryPoint(value as EntryPoint)}
                  required
                >
                  <Space y={0.5}>
                    <RadioGroupItem
                      value={EntryPoint.Current}
                      checked={entryPoint === EntryPoint.Current}
                      title="Där jag bor idag"
                      description="Få prisförslag på din nuvarande adress"
                    >
                      <InputFieldWithHint
                        placeholder="YYMMDDXXXX"
                        inputMode="numeric"
                        required
                        min={11}
                        max={13}
                        name={PersonalNumberField}
                        onKeyDown={(event) => event.key === 'Enter' && form.submitForm()}
                        // https://github.com/personnummer/js
                        pattern="^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+-]?)((?!000)\d{3})(\d)$"
                        errorMessage={personalNumberError && t(personalNumberError)}
                      />
                    </RadioGroupItem>

                    <RadioGroupItem
                      value={EntryPoint.New}
                      checked={entryPoint === EntryPoint.New}
                      title="Dit jag ska flytta"
                      description="Teckna en ny försäkring för en ny adress"
                    />

                    <RadioGroupItem
                      value={EntryPoint.Switch}
                      checked={entryPoint === EntryPoint.Switch}
                      title="Jämför pris och byt"
                      description="Jämför ditt nuvarande pris"
                    >
                      <HighlightBlock>
                        <BulletList y={0.75}>
                          <Bullet>Vi avslutar din nuvarande försäkring</Bullet>
                          <Bullet>Vi försöker alltid ge dig ett bra pris</Bullet>
                          <Bullet>Vi sköter hela bytet åt dig</Bullet>
                        </BulletList>
                      </HighlightBlock>
                    </RadioGroupItem>
                  </Space>
                </RadioGroup.Root>

                <StickyFooter>
                  <FooterContent>
                    <input hidden readOnly name={LocaleField} value={path} />
                    <Button style={{ width: '100%' }}>Fortsätt</Button>
                  </FooterContent>
                </StickyFooter>

                <CaptionText>
                  By continuing, you agree to the Hedvig{' '}
                  <CaptionLink>Terms and Conditions</CaptionLink> and{' '}
                  <CaptionLink>Hedvig Privacy Policy</CaptionLink>.
                </CaptionText>
              </Content>

              <Spacer />
            </Col>
          </Grid>
        </form>
      </PageHeaderLayout>

      <Overlay animate={showLoader ? 'visible' : 'hidden'}>
        <LoadingState />
      </Overlay>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const translations = await serverSideTranslations(locale as string)
  return { props: { ...translations } }
}

export default NewMemberStartPage
