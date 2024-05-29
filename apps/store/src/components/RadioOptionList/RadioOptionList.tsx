import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import type { MouseEventHandler } from 'react'
import { type ComponentProps } from 'react'
import { Text, theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type RootProps = RadioGroup.RadioGroupProps

export const Root = (props: RootProps) => {
  return <RadioGroup.Root {...props}>{props.children}</RadioGroup.Root>
}

type ProductOptionProps = RadioGroup.RadioGroupItemProps & {
  title: string
  subtitle: string
  pillow: ComponentProps<typeof Pillow>
}

export const ProductOption = (props: ProductOptionProps) => {
  const { highlight, animationProps } = useHighlightAnimation<HTMLLabelElement>()

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    highlight()
    props.onClick?.(event)
  }

  return (
    <ProductOptionItem {...animationProps}>
      <Pillow {...props.pillow} size="small" />
      <div>
        <Text as="p" size="md">
          {props.title}
        </Text>
        <Text as="p" size="xs" color="textTranslucentSecondary">
          {props.subtitle}
        </Text>
      </div>
      <Item {...props} onClick={handleClick}>
        <Indicator />
      </Item>
    </ProductOptionItem>
  )
}

const ProductOptionItem = styled.label({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  columnGap: theme.space.sm,
  alignItems: 'center',
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
  height: '4.5rem',
  width: '100%',
  cursor: 'pointer',
  paddingInline: theme.space.md,
})

const Item = styled(RadioGroup.Item)({
  width: '1.375rem',
  height: '1.375rem',

  cursor: 'pointer',
  border: `1px solid ${theme.colors.borderOpaque2}`,
  borderRadius: '50%',

  '&[data-state=checked]': {
    borderColor: theme.colors.textPrimary,
  },

  '&:focus-visible': {
    boxShadow: theme.shadow.focusAlt,
  },
})

const Indicator = styled(RadioGroup.Indicator)({
  display: 'block',
  backgroundColor: theme.colors.textPrimary,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
})
