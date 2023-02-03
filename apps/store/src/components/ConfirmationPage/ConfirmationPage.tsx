import styled from '@emotion/styled'
import Link from 'next/link'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { appStoreLinks } from '@/utils/appStoreLinks'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { AppStoreBadge } from '../AppStoreBadge/AppStoreBadge'
import { CheckList, CheckListItem } from './CheckList'
import { ConfirmationPageProps } from './ConfirmationPage.types'
import { FooterSection } from './FooterSection'

type Props = ConfirmationPageProps & {
  story: ConfirmationStory
}

export const ConfirmationPage = (props: Props) => {
  const { locale } = useCurrentLocale()
  const { platform, cart, story } = props

  const appStoreButton = platform ? (
    <Link href={appStoreLinks[platform]} passHref>
      <AppStoreBadge type={platform} locale={locale} />
    </Link>
  ) : (
    <SpaceFlex space={0.5}>
      <Link href={appStoreLinks.apple} passHref>
        <AppStoreBadge type="apple" locale={locale} />
      </Link>
      <Link href={appStoreLinks.google} passHref>
        <AppStoreBadge type="google" locale={locale} />
      </Link>
    </SpaceFlex>
  )

  const checklistItems = story.content.checklist.split('\n')

  return (
    <Wrapper>
      <Space y={4}>
        <GridLayout.Root>
          <GridLayout.Content>
            <Space y={4}>
              <Space y={1}>
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
                      <CheckListItem.Unchecked title={item}>
                        {appStoreButton}
                      </CheckListItem.Unchecked>
                    ) : (
                      <CheckListItem.Checked title={item} />
                    )
                  })}
                </CheckList>
              </Space>

              <Space y={1}>
                <div>
                  <Heading as="h2" variant="standard.24">
                    {story.content.faqTitle}
                  </Heading>
                  <Text as="p" color="textSecondary" size="xl">
                    {story.content.faqSubtitle}
                  </Text>
                </div>
                <BlockLayoutReset>
                  <ConfirmationPageBlock blok={story.content} />
                </BlockLayoutReset>
              </Space>
            </Space>
          </GridLayout.Content>
        </GridLayout.Root>

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
            <div>{appStoreButton}</div>
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

const BlockLayoutReset = styled.div({
  marginInline: `calc(-1 * ${theme.space.md})`,
})
