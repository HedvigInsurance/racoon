import { css, Global, keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { theme } from 'ui'
import { ProductRecommendationList } from '@/components/ProductRecommendationList/ProductRecommendationList'
import { useProductRecommendations } from '@/components/ProductRecommendationList/useProductRecommendations'

type ErrorPageProps = { children: React.ReactNode }

export const ErrorPage = ({ children }: ErrorPageProps) => {
  const { productRecommendations } = useProductRecommendations()

  return (
    <Layout>
      <Global styles={animation} />
      <Wrapper>{children}</Wrapper>

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
  background: `linear-gradient(180deg, ${theme.colors.signalAmberFill} var(--gradient-position), ${theme.colors.backgroundStandard})`,
  animation: `${gradientAnimation} 2s cubic-bezier(0.65, 0.05, 0.36, 1)`,
  animationIterationCount: 1,
})
