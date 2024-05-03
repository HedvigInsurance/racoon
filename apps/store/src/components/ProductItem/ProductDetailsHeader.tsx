import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { type ComponentProps } from 'react'
import { ChevronIcon, Text, theme } from 'ui'
import { Price } from '@/components/Price'

type Props = {
  expanded: boolean
  price: ComponentProps<typeof Price>
  className?: string
}

export const ProductDetailsHeader = ({ expanded, price, ...radixProps }: Props) => {
  const { t } = useTranslation('cart')

  return (
    <Wrapper {...radixProps}>
      <Trigger as="div">
        {t('VIEW_ENTRY_DETAILS_BUTTON')}
        <AnimatedChevronIcon
          size="1rem"
          color={theme.colors.textTertiary}
          data-state={expanded ? 'expanded' : 'collapsed'}
        />
      </Trigger>

      <Price {...price} />
    </Wrapper>
  )
}

const Wrapper = styled.button({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: theme.space.md,
})

const Trigger = styled(Text)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.xs,

  padding: theme.space.xxxs,
  margin: `-${theme.space.xxxs}`,
  [`${Wrapper}:focus-visible &`]: {
    boxShadow: theme.shadow.focus,
    borderRadius: theme.radius.xxs,
  },
})

const AnimatedChevronIcon = styled(ChevronIcon)({
  transition: 'transform 200ms cubic-bezier(0.77,0,0.18,1)',
  ['&[data-state=expanded]']: { transform: 'rotate(180deg)' },
})
