import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { motion } from 'framer-motion'
import { Space, Text } from 'ui'
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
    <Card y={0.75} {...animationProps}>
      <Text size="md">{label}</Text>
      <RadioGroup.Root onValueChange={handleValueChange} {...props}>
        <SpaceFlex space={1} align="center">
          {children}
        </SpaceFlex>
      </RadioGroup.Root>
    </Card>
  )
}

const Card = styled(motion(Space))(({ theme }) => ({
  padding: `${theme.space.sm} ${theme.space.md}`,
  borderRadius: theme.radius.sm,
  backgroundColor: theme.colors.gray300,
}))

type ItemProps = {
  label: string
  value: string
  id?: string
  autoFocus?: boolean
}

export const Item = ({ value, label, id, autoFocus }: ItemProps) => {
  const identifier = id ?? `radio-${value}`

  return (
    <SpaceFlex space={0.5} align="center">
      <StyledItem id={identifier} value={value} autoFocus={autoFocus}>
        <StyledIndicator />
      </StyledItem>
      <label htmlFor={identifier}>{label}</label>
    </SpaceFlex>
  )
}

const StyledItem = styled(RadioGroup.Item)(({ theme }) => ({
  width: '1.375rem',
  height: '1.375rem',

  border: `1px solid ${theme.colors.gray500}`,
  borderRadius: '50%',

  '&[data-state=checked]': {
    borderColor: theme.colors.gray900,
  },

  '&:focus': {
    // @TODO: pending design
    boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.4)',
  },
}))

const StyledIndicator = styled(RadioGroup.Indicator)(({ theme }) => ({
  display: 'block',
  backgroundColor: theme.colors.gray900,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
}))
