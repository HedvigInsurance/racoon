import { css, Global, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Heading, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { PageLink } from '@/utils/PageLink'

export const FourOhFourPage = () => {
  const { t } = useTranslation()
  const productRecommendations = useProductRecommendations()

  return (
    <Layout>
      <Global styles={animation} />
      <Wrapper>
        <SpaceFlex direction="vertical" align="center" space={1.5}>
          <Heading as="h1" variant={{ _: 'standard.24', lg: 'standard.32' }}>
            {t('404_PAGE_MESSAGE')}
          </Heading>

          <ButtonNextLink
            variant="primary"
            size={{ base: 'small', lg: 'medium' }}
            href={PageLink.home()}
          >
            {t('404_PAGE_BUTTON')}
          </ButtonNextLink>
        </SpaceFlex>
      </Wrapper>

      {productRecommendations && productRecommendations.length > 0 && (
        <ProductRecommendationList recommendations={productRecommendations} />
      )}
    </Layout>
  )
}

const Layout = styled.div({
  paddingBottom: theme.space[10],
})

// Not supported by Emotion so need to add it using global styles
const animation = css`
  @property --gradient-position {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 75%;
  }
`

const gradientAnimation = keyframes({
  '0%': {
    '--gradient-position': '0%',
  },
  '100%': {
    '--gradient-position': '75%',
  },
})

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  height: '80vh',
  background: `linear-gradient(180deg, ${theme.colors.amberFill1} var(--gradient-position), ${theme.colors.backgroundStandard})`,
  animation: `${gradientAnimation} 2s cubic-bezier(0.65, 0.05, 0.36, 1)`,
  animationIterationCount: 1,
})
