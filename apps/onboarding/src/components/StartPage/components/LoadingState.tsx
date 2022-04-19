import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { PageHeaderLayout } from '@/components/page-header-layout'

const AnimatedOverlay = styled(motion.div)(() => ({
  position: 'fixed',
  zIndex: 9999,
  inset: 0,
  display: 'none',
}))

AnimatedOverlay.defaultProps = {
  variants: {
    visible: {
      opacity: 1,
      display: 'block',
    },
    hidden: {
      opacity: 0,
      transitionEnd: {
        display: 'none',
      },
    },
  },
}

const Wrapper = styled.div({
  display: 'flex',
  flex: '1 1 0',
  flexDirection: 'column',
  alignItems: 'stretch',
  textAlign: 'center',
  justifyContent: 'center',
})

const LoadingContent = styled.div({
  position: 'relative',
  margin: '0 auto',
  overflow: 'hidden',
  boxSizing: 'border-box',
  padding: '1rem',
})

const Overlay = styled.div(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: `linear-gradient(${theme.colors.gray100}, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), ${theme.colors.gray100})`,
}))

const fadeInUp = keyframes({
  '35%, 50%': {
    opacity: 1,
    transform: 'translate3d(0, 0, 0)',
  },
  '0%': {
    opacity: 0,
    transform: 'translate3d(0, 400px, 0)',
  },
  '100%': {
    opacity: 0,
    transform: 'translate3d(0, -400px, 0)',
  },
})

const Text = styled.p(({ theme }) => ({
  margin: 0,
  fontSize: '1.5rem',
  lineHeight: 1.5,
  fontFamily: theme.fonts.body,

  opacity: 0,
  animation: `${fadeInUp} 5.5s cubic-bezier(0.39, 0.575, 0.565, 1) infinite`,
}))

type Props = {
  visible: boolean
}

export const LoadingState = ({ visible }: Props) => {
  const { t } = useTranslation()
  const lines = t('START_SCREEN_LOADER').split('\n')

  return (
    <AnimatedOverlay animate={visible ? 'visible' : 'hidden'}>
      <PageHeaderLayout>
        <Wrapper>
          <LoadingContent>
            {lines.map((text, i) => (
              <Text key={i} style={{ animationDelay: `${i * 150}ms` }}>
                {text}
              </Text>
            ))}
            <Overlay />
          </LoadingContent>
        </Wrapper>
      </PageHeaderLayout>
    </AnimatedOverlay>
  )
}
