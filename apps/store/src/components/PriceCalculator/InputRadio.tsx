import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'framer-motion'
import { useRef, forwardRef, FormEventHandler, ComponentPropsWithoutRef } from 'react'
import { Space, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type RootProps = {
  label: string
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  required?: boolean
  defaultValue?: string
  name?: string
}

export const Root = ({ children, label, onValueChange, ...props }: RootProps) => {
  const { highlight, animationProps } = useHighlightAnimation()

  const handleValueChange = (value: string) => {
    highlight()
    onValueChange?.(value)
  }

  return (
    <Card y={0.5} {...animationProps}>
      <Text size="xs" color="textSecondary">
        {label}
      </Text>
      <RadioGroup.Root onValueChange={handleValueChange} aria-label={label} {...props}>
        <SpaceFlex space={1} align="center">
          {children}
        </SpaceFlex>
      </RadioGroup.Root>
    </Card>
  )
}

const Card = styled(motion(Space))({
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
})

type ItemProps = {
  label: string
  value: string
} & Omit<ComponentPropsWithoutRef<'button'>, 'value'>

export const Item = forwardRef<HTMLButtonElement, ItemProps>(
  ({ value, label, id, ...itemProps }, ref) => {
    const identifier = id ?? `radio-${value}`

    return (
      <SpaceFlex space={0.5} align="center">
        <StyledItem ref={ref} id={identifier} value={value} {...itemProps}>
          <StyledIndicator />
        </StyledItem>
        <label htmlFor={identifier}>
          <Text as="span" size="xl">
            {label}
          </Text>
        </label>
      </SpaceFlex>
    )
  },
)
Item.displayName = 'Item'

const StyledItem = styled(RadioGroup.Item)({
  width: '1.375rem',
  height: '1.375rem',

  cursor: 'pointer',
  border: `1px solid ${theme.colors.gray500}`,
  borderRadius: '50%',

  '&[data-state=checked]': {
    borderColor: theme.colors.gray1000,
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.gray500}`,
  },
})

const StyledIndicator = styled(RadioGroup.Indicator)({
  display: 'block',
  backgroundColor: theme.colors.gray1000,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
})

export const HorizontalRoot = ({ label, children, ...rootProps }: RootProps) => {
  return (
    <StyledHorizontalRoot aria-label={label} {...rootProps}>
      {children}
    </StyledHorizontalRoot>
  )
}

const StyledHorizontalRoot = styled(RadioGroup.Root)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.space.xxs,
})

export const HorizontalItem = ({ onChange, ...props }: ItemProps) => {
  const radioButtonRef = useRef<HTMLButtonElement | null>(null)
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: FormEventHandler<HTMLButtonElement> = (event) => {
    highlight()
    onChange?.(event)
  }

  return (
    <Card onClick={() => radioButtonRef.current?.click()} {...animationProps}>
      <Item
        ref={radioButtonRef}
        {...props}
        onChange={handleChange}
        onClick={(event) => {
          // This prevents click events fired on Radio Button being also
          // handled by the Card.
          event.stopPropagation()
        }}
      />
    </Card>
  )
}
