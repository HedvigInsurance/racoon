import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { AppStoreBadge } from '@/components/AppStoreBadge/AppStoreBadge'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { getAppStoreLink } from '@/utils/appStoreLinks'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { CheckList, CheckListItem } from './CheckList'
import { ConfirmationPageProps } from './ConfirmationPage.types'
import qrCodeImage from './download-app-qrcode.png'
import { FooterSection } from './FooterSection'

type Props = ConfirmationPageProps & {
  story: ConfirmationStory
}

export const ConfirmationPage = (props: Props) => {
  const { t } = useTranslation('checkout')
  const { locale, routingLocale } = useCurrentLocale()
  const { platform, cart, story } = props

  const appDownloadAction = platform ? (
    <Link href={getAppStoreLink(platform, routingLocale)} passHref>
      <AppStoreBadge type={platform} locale={locale} />
    </Link>
  ) : (
    <ImageWithPlaceholder
      src={qrCodeImage}
      alt={t('APP_DOWNLOAD_QRCODE_ALT')}
      width={128}
      height={128}
      priority={true}
    />
  )

  const checklistItems = story.content.checklist.split('\n')

  return (
    <Wrapper>
      <Space y={4}>
        <GridLayout.Root>
          <GridLayout.Content width="1/2" align="center">
            <Space y={4}>
              <Space y={{ base: 1.5, lg: 3 }}>
                <div>
                  <Heading as="h1" variant="standard.24">
                    {story.content.title}
                  </Heading>
                  <Text as="p" color="textSecondary" size="xl">
                    {story.content.subtitle}
                  </Text>
                </div>
                <CartInventory cart={cart} readOnly />
              </Space>

              <Space y={1}>
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
                      <CheckListItem.Unchecked key={item} title={item}>
                        {appDownloadAction}
                      </CheckListItem.Unchecked>
                    ) : (
                      <CheckListItem.Checked key={item} title={item} />
                    )
                  })}
                </CheckList>
              </Space>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

        <ConfirmationPageBlock blok={story.content} />

        <FooterSection
          image={{ src: story.content.footerImage.filename, alt: story.content.footerImage.alt }}
        >
          <Space y={1.5}>
            <div>
              <Heading as="h2" variant="standard.24">
                {story.content.footerTitle}
              </Heading>
              <Text as="p" color="textSecondary" size="xl">
                {story.content.footerSubtitle}
              </Text>
            </div>
            <div>{appDownloadAction}</div>
          </Space>
        </FooterSection>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  paddingTop: theme.space.md,

  [mq.lg]: {
    paddingTop: theme.space.xxxl,
  },
})
