import { css, Global } from '@emotion/react'
import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Button, HeadingOLD, Space } from 'ui'
import { HeroImage } from '@/components/hero-image'
import { PageHeaderLayout } from '@/components/page-header-layout'
import { useForm } from '@/hooks/useForm'
import { useCurrentLocale } from '@/lib/l10n'
import { PageLink } from '@/lib/PageLink'
import * as Analytics from '@/services/analytics/analytics'
import { Bullet, BulletList } from './components/BulletList'
import { CaptionText } from './components/CaptionText'
import { ContentWrapper } from './components/ContentWrapper'
import { Col, Grid } from './components/Grid'
import { HighlightBlock } from './components/HighlightBlock'
import { InputFieldWithHint } from './components/InputFieldWithHint'
import { LoadingState } from './components/LoadingState'
import { RadioGroupItem } from './components/RadioGroupItem'
import { StickyFooter } from './components/StickyFooter'
import { SubHeading } from './components/SubHeading'
import { EntryPoint, InputField } from './StartPage.constants'
import { handleSubmitForm } from './StartPage.helpers'

const Spacer = styled.div({
  height: '6rem',
})

// Reference: https://stackoverflow.com/a/39289453
const scrollbarShiftFix = css({
  html: {
    overflowX: 'hidden',
    marginRight: 'calc(-1 * (100vw - 100%))',
  },
})

export const StartPage = () => {
  const { path } = useCurrentLocale()
  const [entryPoint, setEntryPoint] = useState<EntryPoint>()
  const { t } = useTranslation()

  const form = useForm({
    action: PageLink.startFormApi(),
    onSubmit: handleSubmitForm,
    onSuccess: ({ redirectUrl }) => {
      if (entryPoint === EntryPoint.Current && redirectUrl?.includes('/offer/') !== true) {
        Analytics.ssnFetchingFailed()
      }
    },
  })

  const personalNumberError = form.errors?.[InputField.PersonalNumber]
  const showLoader = form.state === 'submitting' && entryPoint === EntryPoint.Current

  return (
    <>
      <Global styles={scrollbarShiftFix} />
      <PageHeaderLayout headerVariant="light">
        <form {...form.formProps}>
          <Grid>
            <HeroImage
              mobileImgSrc="/racoon-assets/hero_start_mobile.jpg"
              desktopImgSrc="/racoon-assets/hero_start_desktop.jpg"
            />
            <Col>
              <ContentWrapper y={2}>
                <Space y={1}>
                  <HeadingOLD variant="s" headingLevel="h1" colorVariant="dark">
                    {t('START_SCREEN_HEADER')}
                  </HeadingOLD>
                  <SubHeading>{t('START_SCREEN_SUBHEADER')}</SubHeading>
                </Space>
                <RadioGroup.Root
                  name={InputField.EntryPoint}
                  value={entryPoint}
                  onValueChange={(value) => setEntryPoint(value as EntryPoint)}
                  required
                >
                  <Space y={0.5}>
                    <RadioGroupItem
                      value={EntryPoint.Current}
                      checked={entryPoint === EntryPoint.Current}
                      title={t('START_SCREEN_OPTION_CURRENT_HEADER')}
                      description={t('START_SCREEN_OPTION_CURRENT_SUBHEADER')}
                    >
                      <InputFieldWithHint
                        placeholder="YYMMDDXXXX"
                        inputMode="numeric"
                        required
                        min={10}
                        max={13}
                        name={InputField.PersonalNumber}
                        onKeyDown={(event) => event.key === 'Enter' && form.submitForm()}
                        // https://github.com/personnummer/js
                        pattern="^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([+-]?)((?!000)\d{3})(\d)$"
                        title={t('START_SCREEN_PERSONAL_NUMBER_INPUT_TITLE')}
                        errorMessage={personalNumberError && t(personalNumberError)}
                      />
                    </RadioGroupItem>

                    <RadioGroupItem
                      value={EntryPoint.New}
                      checked={entryPoint === EntryPoint.New}
                      title={t('START_SCREEN_OPTION_NEW_HEADER')}
                      description={t('START_SCREEN_OPTION_NEW_SUBHEADER')}
                    />

                    <RadioGroupItem
                      value={EntryPoint.Switch}
                      checked={entryPoint === EntryPoint.Switch}
                      title={t('START_SCREEN_OPTION_SWITCH_HEADER')}
                      description={t('START_SCREEN_OPTION_SWITCH_SUBHEADER')}
                    >
                      <HighlightBlock>
                        <BulletList y={0.75}>
                          <Bullet>{t('START_SCREEN_OPTION_SWITCH_USP_1')}</Bullet>
                          <Bullet>{t('START_SCREEN_OPTION_SWITCH_USP_2')}</Bullet>
                          <Bullet>{t('START_SCREEN_OPTION_SWITCH_USP_3')}</Bullet>
                        </BulletList>
                      </HighlightBlock>
                    </RadioGroupItem>
                  </Space>
                </RadioGroup.Root>
                <StickyFooter>
                  <input hidden readOnly name={InputField.Locale} value={path} />
                  <Button fullWidth>{t('START_SCREEN_SUBMIT_BUTTON')}</Button>
                </StickyFooter>
                <CaptionText dangerouslySetInnerHTML={{ __html: t('START_SCREEN_FOOTER_TOS') }} />
              </ContentWrapper>

              <Spacer />
            </Col>
          </Grid>
        </form>
      </PageHeaderLayout>

      <LoadingState visible={showLoader} />
    </>
  )
}
