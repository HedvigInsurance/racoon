import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler } from 'react'
import { ChevronIcon, InputBase, InputBaseProps, theme } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

type InputSelectProps = InputBaseProps & {
  name: string
  options: ReadonlyArray<{ name: string; value: string }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
  className?: string
  size?: 'large' | 'small'
}

export const InputSelect = ({
  options,
  name,
  onChange,
  value,
  defaultValue,
  placeholder,
  label,
  className,
  size = 'large',
  ...rest
}: InputSelectProps) => {
  const { highlight, animationProps } = useHighlightAnimation()

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange?.(event)
    highlight()
  }

  const labelText = label || placeholder

  return (
    <InputBase {...rest}>
      {() => (
        <Wrapper className={className} {...animationProps}>
          <StyledSelect
            name={name}
            onChange={handleChange}
            value={value}
            defaultValue={value ? undefined : defaultValue ?? ''}
            placeholder={placeholder}
            variantSize={size}
            {...rest}
          >
            {labelText && (
              <Placeholder value="" disabled>
                {labelText}
              </Placeholder>
            )}
            {options.map(({ name, value }) => (
              <option key={value} value={value}>
                {name}
              </option>
            ))}
          </StyledSelect>

          <StyledChevronIcon size="1rem" />
        </Wrapper>
      )}
    </InputBase>
  )
}

const Wrapper = styled(motion.div)({
  position: 'relative',
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.sm,

  ':hover, :focus-within': {
    backgroundColor: theme.colors.gray300,
  },
})

const StyledChevronIcon = styled(ChevronIcon)({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
})

type SelectProps = { variantSize: Required<InputSelectProps['size']> }

const StyledSelect = styled.select<SelectProps>(({ variantSize }) => ({
  color: theme.colors.textPrimary,
  borderRadius: theme.radius.sm,
  width: '100%',
  paddingBlock: theme.space.xs,
  paddingLeft: theme.space.md,
  paddingRight: theme.space.xxl,
  cursor: 'pointer',

  ...(variantSize === 'small' && {
    fontSize: theme.fontSizes.md,
  }),

  ...(variantSize === 'large' && {
    fontSize: theme.fontSizes.xl,
  }),
}))

const Placeholder = styled.option({
  color: theme.colors.textSecondary,
})
