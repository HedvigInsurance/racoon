import styled from '@emotion/styled'
import Link from 'next/link'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { CartInventory } from '@/components/CartInventory/CartInventory'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ConfirmationStory } from '@/services/storyblok/storyblok'
import { useCurrentLocale } from '@/utils/l10n/useCurrentLocale'
import { AppStoreBadge } from '../AppStoreBadge/AppStoreBadge'
import { CheckList, CheckListItem } from './CheckList'
import { ConfirmationPageProps } from './ConfirmationPage.types'

const appStoreLinks = {
  apple: 'https://apps.apple.com/se/app/id1303668531?l=en',
  google: 'https://play.google.com/store/apps/details?id=com.hedvig.app',
} as const

type Props = ConfirmationPageProps & {
  story: ConfirmationStory
}

export const ConfirmationPage = (props: Props) => {
  const { locale } = useCurrentLocale()
  const { platform, cart, story } = props

  return (
    <Wrapper>
      <Space y={4}>
        <header>
          <Heading as="h1" variant="standard.24">
            Ditt köp är klart!
          </Heading>
          <Text as="p" color="textSecondary" size="xl">
            En bekräftelse har skickats via mail.
          </Text>
        </header>
        <main>
          <Space y={4}>
            <section>
              <CartInventory cart={cart} readOnly />
            </section>
            <section>
              <Space y={1}>
                <div>
                  <Heading as="h1" variant="standard.24">
                    Vad händer nu?
                  </Heading>
                  <Text as="p" color="textSecondary" size="xl">
                    Ladda ner Hedvig appen till din mobil och kom igång med din nya försäkring.
                  </Text>
                </div>
                <Space y={0.5}>
                  <CheckList>
                    <CheckListItem.Checked title="Teckna Hedvig" />
                    <CheckListItem.Checked title="Koppla autogiro" />
                    <CheckListItem.Unchecked title="Ladda ner Hedvig appen">
                      {platform ? (
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
                      )}
                    </CheckListItem.Unchecked>
                  </CheckList>
                </Space>
              </Space>
            </section>
          </Space>
        </main>
      </Space>
      <ConfirmationPageBlock blok={story.content} />
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingInline: theme.space.md,

  [mq.sm]: {
    display: 'grid',
    gridTemplateColumns: 'minmax(28rem, 33%)',
    justifyContent: 'center',
  },
})
