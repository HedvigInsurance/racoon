import styled from '@emotion/styled'
import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { Space, Text, theme } from 'ui'

const ANIMATION_DURATION_SEC = 2

export const completePriceLoader = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ANIMATION_DURATION_SEC * 1000)
  })

export const PriceLoader = () => {
  const { t } = useTranslation('purchase-form')

  return (
    <Space y={1.5}>
      <Text size="md" align="center">
        {t('LOADING_PRICE_ANIMATION_LABEL')}
      </Text>
      <Bar>
        <ProgressBar variants={VARIANTS} initial="enter" animate="animate" exit="enter" />
      </Bar>
    </Space>
  )
}

const VARIANTS: Variants = {
  enter: {
    width: '0%',
  },
  animate: {
    width: '100%',
    transition: {
      delay: 0,
      // Acconut for delay in mounting the component
      duration: ANIMATION_DURATION_SEC * 0.8,
      ease: 'easeInOut',
    },
  },
}

const Bar = styled.div({
  height: theme.space.xxs,
  marginInline: 'auto',
  backgroundColor: theme.colors.textTranslucentTertiary,
  borderRadius: theme.radius.xxs,
})

const ProgressBar = styled(motion.div)({
  height: '100%',
  backgroundColor: theme.colors.textPrimary,
  borderRadius: theme.radius.xxs,
})
