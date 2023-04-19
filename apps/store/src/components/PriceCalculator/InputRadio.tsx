import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'framer-motion'
import { FormEventHandler, ComponentPropsWithoutRef } from 'react'
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

export const Item = ({ value, label, id, className, ...itemProps }: ItemProps) => {
  const identifier = id ?? `radio-${value}`

  return (
    <ClickableLabel className={className} htmlFor={identifier}>
      <SpaceFlex space={0.5} align="center">
        <StyledItem id={identifier} value={value} {...itemProps}>
          <StyledIndicator />
        </StyledItem>
        <Text as="span" size="xl">
          {label}
        </Text>
      </SpaceFlex>
    </ClickableLabel>
  )
}

const ClickableLabel = styled.label({ cursor: 'pointer' })

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
  const handleChange: FormEventHandler<HTMLButtonElement> = (event) => {
    onChange?.(event)
  }

  return <StyledHorizontalItem {...props} onChange={handleChange} />
}

const StyledHorizontalItem = styled(Item)({
  cursor: 'pointer',
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray100,
})
