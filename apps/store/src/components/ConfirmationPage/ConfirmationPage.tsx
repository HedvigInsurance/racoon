import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'
import { AndroidIcon, AppleIcon, Button, Heading, mq, Space, Text, theme } from 'ui'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { Features } from '@/utils/Features'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { SasEurobonusSectionContainer } from '../../features/sas/SasEurobonusSection'
import { SpaceFlex } from '../SpaceFlex/SpaceFlex'
import { CheckList, CheckListItem } from './CheckList'
import { ConfirmationPageProps } from './ConfirmationPage.types'
import qrCodeImage from './download-app-qrcode.png'
import { ImageSection } from './ImageSection'
import { SwitchingAssistantSection } from './SwitchingAssistantSection'

type Props = ConfirmationPageProps & {
  story: ConfirmationStory
}

export const ConfirmationPage = (props: Props) => {
  const { t } = useTranslation('checkout')
  const { cart, story } = props

  const checklistItems = story.content.checklist.split('\n')

  return (
    <Wrapper>
      <Space y={4}>
        <GridLayout.Root>
          <GridLayout.Content width="1/3" align="center">
            <Space y={4}>
              <Space y={{ base: 3, lg: 4.5 }}>
                <Heading as="h1" variant="standard.24" align="center">
                  {story.content.title}
                </Heading>
                <CartInventory shopSessionId={props.shopSessionId} cart={cart} readOnly />
              </Space>

              {props.switching && (
                <SwitchingAssistantSection
                  shopSessionId={props.shopSessionId}
                  {...props.switching}
                />
              )}

              {Features.enabled('SAS_PARTNERSHIP') && props.memberPartnerData?.sas?.eligible && (
                <SasEurobonusSectionContainer
                  initialValue={props.memberPartnerData.sas.eurobonusNumber ?? ''}
                />
              )}

              <Space y={{ base: 1.5, lg: 2 }}>
                <div>
                  <Heading as="h2" variant="standard.24">
                    {story.content.checklistTitle}
                  </Heading>
                  <Text as="p" color="textSecondary" size="xl">
                    {story.content.checklistSubtitle}
                  </Text>
                </div>
                <CheckList>
                  {checklistItems.map((item, index) => {
                    const isLast = index === checklistItems.length - 1
                    return isLast ? (
                      <Fragment key={item}>
                        <CheckListItem.Disabled title={item} />
                        <DownloadAppWrapper>
                          <SpaceFlex direction="vertical" align="center">
                            <ImageWithPlaceholder
                              src={qrCodeImage}
                              alt={t('APP_DOWNLOAD_QRCODE_ALT')}
                              width={168}
                              height={168}
                              priority={true}
                            />
                          </SpaceFlex>

                          <Text align="center">{t('APP_DOWNLOAD_QRCODE_TEXT')}</Text>

                          <AppStoreButtons />
                        </DownloadAppWrapper>
                      </Fragment>
                    ) : (
                      <CheckListItem.Checked key={item} title={item} />
                    )
                  })}
                </CheckList>
              </Space>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        <div>
          <ImageSection
            image={{ src: story.content.footerImage.filename, alt: story.content.footerImage.alt }}
          />

          <ConfirmationPageBlock blok={story.content} />
        </div>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  paddingTop: theme.space.md,
  paddingBottom: theme.space.xxxl,

  [mq.lg]: {
    paddingBlock: theme.space.xxxl,
  },
})

const DownloadAppWrapper = styled.div({
  paddingTop: theme.space.xxxl,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xl,
})

const AppStoreButtons = () => {
  const { routingLocale } = useCurrentLocale()

  return (
    <ButtonWrapper>
      <Button
        href={getAppStoreLink('apple', routingLocale).toString()}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="medium"
      >
        <SpaceFlex space={0.5} align="center">
          <AppleIcon />
          App Store
        </SpaceFlex>
      </Button>
      <Button
        href={getAppStoreLink('google', routingLocale).toString()}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        size="medium"
      >
        <SpaceFlex space={0.5} align="center">
          <AndroidIcon />
          Google Play
        </SpaceFlex>
      </Button>
    </ButtonWrapper>
  )
}

const ButtonWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridGap: theme.space.xs,
})
