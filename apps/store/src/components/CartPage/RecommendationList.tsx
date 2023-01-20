import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from 'next/link'
import { Heading, mq, Space, Text, theme } from 'ui'
import { ProductRecommendationFragment } from '@/services/apollo/generated'

type Props = {
  recommendations: Array<ProductRecommendationFragment>
}

export const RecommendationList = ({ recommendations }: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Wrapper y={1.5}>
      <MobileHeader>
        <Heading as="h2" variant="standard.24">
          {t('RECOMMENDATIONS_HEADING')}
        </Heading>
      </MobileHeader>
      <DesktopHeader>
        <Heading as="h2" variant="standard.32">
          {t('RECOMMENDATIONS_HEADING')}
        </Heading>
      </DesktopHeader>

      <List>
        {recommendations.map((recommendation) => (
          <Link key={recommendation.id} href={recommendation.pageLink}>
            <Space y={0.5}>
              <StyledImage
                // TODO: Use the correct image
                src="https://a.storyblok.com/f/165473/330x396/573a75c77d/home-low.png"
                alt=""
                width={330}
                height={396}
              />
              <ListItemContent>
                <Heading as="h3" variant="standard.18">
                  {recommendation.displayNameShort}
                </Heading>
                <Text color="textSecondary">{recommendation.displayNameFull}</Text>
              </ListItemContent>
            </Space>
          </Link>
        ))}
      </List>
    </Wrapper>
  )
}

const Wrapper = styled(Space)({
  paddingInline: theme.space.xs,
  paddingBottom: theme.space.xl,

  maxWidth: '40rem',
  marginInline: 'auto',

  [mq.lg]: {
    maxWidth: '100%',
  },
})

const MobileHeader = styled.div({
  paddingInline: theme.space.xs,

  [mq.lg]: {
    display: 'none',
  },
})

const DesktopHeader = styled.div({
  display: 'none',

  [mq.lg]: {
    display: 'flex',
    justifyContent: 'center',
  },
})

const List = styled.div({
  display: 'grid',
  gridGap: theme.space.md,

  [mq.sm]: {
    gridTemplateColumns: 'repeat(auto-fit, 19rem)',
  },

  [mq.lg]: {
    justifyContent: 'center',
  },
})

const ListItemContent = styled.div({
  paddingInline: theme.space.xs,

  [mq.lg]: { paddingInline: 0 },
})

const StyledImage = styled(Image)({ width: '100%' })
