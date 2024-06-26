import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Fragment } from 'react'
import { AndroidIcon, AppleIcon, Button, Heading, Space, Text, theme } from 'ui'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import * as GridLayout from '@/components/GridLayout/GridLayout'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { type ConfirmationStory } from '@/services/storyblok/storyblok'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useRoutingLocale } from '@/utils/l10n/useRoutingLocale'
import { CheckList, CheckListItem } from './CheckList'
import qrCodeImage from './download-app-qrcode.png'
import { ImageSection } from './ImageSection'

type Props = {
  content: ConfirmationStory['content']
}

export const StaticContent = (props: Props) => {
  const { t } = useTranslation('checkout')
  const checklistItems = props.content.checklist.split('\n')

  return (
    <Space y={4}>
      <GridLayout.Root>
        <GridLayout.Content width="1/3" align="center">
          <Space y={{ base: 1.5, lg: 2 }}>
            <div>
              <Heading as="h2" variant="standard.24">
                {props.content.checklistTitle}
              </Heading>
              <Text as="p" color="textSecondary" size="xl">
                {props.content.checklistSubtitle}
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
        </GridLayout.Content>
      </GridLayout.Root>

      <div>
        <ImageSection
          image={{
            src: getImgSrc(props.content.footerImage.filename),
            alt: props.content.footerImage.alt,
          }}
        />

        <ConfirmationPageBlock blok={props.content} />
      </div>
    </Space>
  )
}

const DownloadAppWrapper = styled.div({
  paddingTop: theme.space.xxxl,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xl,
})

const AppStoreButtons = () => {
  const locale = useRoutingLocale()

  return (
    <ButtonWrapper>
      <Button
        as="a"
        href={getAppStoreLink('apple', locale).toString()}
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
        as="a"
        href={getAppStoreLink('google', locale).toString()}
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
