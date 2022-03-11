import * as RadioGroup from '@radix-ui/react-radio-group'

import { AnimatePresence, motion } from 'framer-motion'
import { Bullet, BulletList } from './components/bullet-list'
import { Button, Heading, InputField, Space, mq } from 'ui'
import {
  EntryPoint,
  EntryPointField,
  LocaleField,
  MarketField,
  PersonalNumberField,
} from './shared'

import { Hero } from '../cart/components/hero'
import LoadingPage from './loading.page'
import type { NextPage } from 'next'
import { PageLayout } from './components/page-layout'
import { Tick } from './components/icons/tick'
import styled from '@emotion/styled'
import { useCurrentLocale } from '@/lib/l10n'
import { useForm } from '@/hooks/use-form'
import { useState } from 'react'

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

const Content = styled(Space)({
  padding: '1rem',
  width: '100%',
  minHeight: '100%',
  maxWidth: '30rem',
  margin: '0 auto',

  [mq.md]: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '6rem 1rem',
  },
})

const Text = styled.p(({ theme }) => ({
  lineHeight: '1.5rem',
  fontSize: '1rem',
  color: theme.colors.gray700,
  margin: 0,
}))

const Option = styled(RadioGroup.Item)(({ theme }) => ({
  padding: '1rem',
  backgroundColor: theme.colors.white,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  width: '100%',

  border: '2px solid transparent',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',

  ['&[data-state=checked]']: {
    borderColor: theme.colors.gray900,
  },

  '&:focus': {
    outlineColor: theme.colors.gray500,
  },
}))

const OptionInner = styled.div({
  display: 'flex',
  gap: '1rem',
})

const OptionIndicatorWrapper = styled.div(({ theme }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '1.375rem',
  width: '1.375rem',
  border: `1px solid ${theme.colors.gray900}`,
  borderRadius: '0.75rem',
  cursor: 'pointer',
  flexShrink: 0,
}))

const OptionIndicator = styled(RadioGroup.Indicator)(({ theme }) => ({
  backgroundColor: theme.colors.gray900,
  borderRadius: '0.75rem',
  width: '100%',
  height: '100%',
}))

const OptionTitle = styled.h3(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.body,
  fontSize: '1.125rem',
  lineHeight: 1,
}))
const OptionText = styled.p(({ theme }) => ({
  margin: 0,
  fontFamily: theme.fonts.body,
  fontSize: '0.875rem',
  lineHeight: 1,
  color: theme.colors.gray600,
}))

const HighlightBlock = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray200,
  padding: '1rem',
  borderRadius: '0.25rem',
}))

const CaptionLink = styled.a(({ theme }) => ({
  fontFamily: theme.fonts.body,
  color: theme.colors.gray500,
  textDecoration: 'underline',
  cursor: 'pointer',
}))

const StickyFooter = styled.div(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  width: '100%',
  backgroundColor: theme.colors.white,
  padding: '1rem',
  paddingBottom: '2rem',
  boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05), 0px -8px 16px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  justifyContent: 'stretch',

  [mq.md]: {
    width: '50vw',
  },
}))

const FooterContent = styled.div({
  width: '100%',
  maxWidth: '600px',
  margin: 'auto',
})

const Spacer = styled.div({
  height: '6rem',
})

const AnimatedContentWrapper = styled(motion.div)({
  paddingTop: '1.5rem',
})

type AnimatedContentProps = {
  children: React.ReactNode
  animateKey: string
}

const AnimatedContent = ({ children, animateKey }: AnimatedContentProps) => {
  return (
    <motion.div
      key={animateKey}
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { opacity: 1, height: 'auto' },
        collapsed: { opacity: 0, height: 0 },
      }}
      transition={{ duration: 0.25 }}
      style={{ overflow: 'hidden' }}
    >
      <AnimatedContentWrapper>{children}</AnimatedContentWrapper>
    </motion.div>
  )
}

const NewMemberStartPage: NextPage = () => {
  const { apiMarket, isoLocale } = useCurrentLocale()
  const form = useForm({ action: '/api/pages/start' })
  const [entryPoint, setEntryPoint] = useState(EntryPoint.Current)

  if (form.state === 'submitting') return <LoadingPage />

  return (
    <PageLayout headerVariant="light">
      <form {...form.formProps}>
        <Grid>
          <Hero
            mobileImgSrc="/racoon-assets/hero_start_mobile.jpg"
            desktopImgSrc="/racoon-assets/hero_start_desktop.jpg"
          />
          <Col>
            <Content y={1}>
              <Heading variant="s" headingLevel="h1" colorVariant="dark">
                Få prisförslag, jämför och försäkring hos Hedvig direkt
              </Heading>
              <Text>Få prisförslag</Text>

              <RadioGroup.Root
                name={EntryPointField}
                value={entryPoint}
                onValueChange={(value) => setEntryPoint(value as EntryPoint)}
              >
                <Space y={0.5}>
                  <Option value={EntryPoint.Current}>
                    <OptionInner>
                      <OptionIndicatorWrapper>
                        <OptionIndicator>
                          <Tick size={20} />
                        </OptionIndicator>
                      </OptionIndicatorWrapper>
                      <Space y={0.5}>
                        <OptionTitle>Där jag bor idag</OptionTitle>
                        <OptionText>Få prisförslag på din nuvarande adress</OptionText>
                      </Space>
                    </OptionInner>

                    <AnimatePresence initial={false}>
                      {entryPoint === EntryPoint.Current && (
                        <AnimatedContent animateKey={EntryPoint.Current}>
                          <InputField
                            label="Personnummer"
                            placeholder="YYMMDDXXXX"
                            inputMode="numeric"
                            required
                            name={PersonalNumberField}
                            onKeyDown={(event) => event.key === 'Enter' && form.submitForm()}
                            // https://github.com/personnummer/js
                            pattern="^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+-]?)((?!000)\d{3})(\d)$"
                          />

                          <CaptionLink href="https://www.hedvig.com/se/personuppgifter">
                            Så hanterar vi dina personuppgifter
                          </CaptionLink>

                          <input hidden readOnly name={MarketField} value={apiMarket} />
                        </AnimatedContent>
                      )}
                    </AnimatePresence>
                  </Option>

                  <motion.div>
                    <Option value={EntryPoint.New}>
                      <OptionInner>
                        <OptionIndicatorWrapper>
                          <OptionIndicator>
                            <Tick size={20} />
                          </OptionIndicator>
                        </OptionIndicatorWrapper>
                        <Space y={0.5}>
                          <OptionTitle>Dit jag ska flytta</OptionTitle>
                          <OptionText>Teckna en ny försäkring för en ny adress</OptionText>
                        </Space>
                      </OptionInner>
                    </Option>
                  </motion.div>

                  <motion.div>
                    <Option value={EntryPoint.Switch}>
                      <OptionInner>
                        <OptionIndicatorWrapper>
                          <OptionIndicator>
                            <Tick size={20} />
                          </OptionIndicator>
                        </OptionIndicatorWrapper>
                        <Space y={0.5}>
                          <OptionTitle>Jämför pris och byt</OptionTitle>
                          <OptionText>Jämför ditt nuvarande pris</OptionText>
                        </Space>
                      </OptionInner>

                      <AnimatePresence initial={false}>
                        {entryPoint === EntryPoint.Switch && (
                          <AnimatedContent animateKey={EntryPoint.Switch}>
                            <HighlightBlock>
                              <BulletList y={0.75}>
                                <Bullet>Vi avslutar din nuvarande försäkring</Bullet>
                                <Bullet>Vi försöker alltid ge dig ett bra pris</Bullet>
                                <Bullet>Vi sköter hela bytet åt dig</Bullet>
                              </BulletList>
                            </HighlightBlock>
                          </AnimatedContent>
                        )}
                      </AnimatePresence>
                    </Option>
                  </motion.div>
                </Space>
              </RadioGroup.Root>
            </Content>

            <Spacer />

            <StickyFooter>
              <FooterContent>
                <input hidden readOnly name={LocaleField} value={isoLocale} />
                <Button style={{ width: '100%' }}>Fortsätt</Button>
              </FooterContent>
            </StickyFooter>
          </Col>
        </Grid>
      </form>
    </PageLayout>
  )
}

export default NewMemberStartPage
