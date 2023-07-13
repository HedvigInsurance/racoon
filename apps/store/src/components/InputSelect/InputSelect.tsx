import isValidProp from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { ChangeEventHandler } from 'react'
import { ChevronIcon, InputBase, InputBaseProps, theme } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

export type InputSelectProps = InputBaseProps & {
  name: string
  options: ReadonlyArray<{ name: string; value: string }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  disabled?: boolean
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
  size = 'large',
  ...rest
}: InputSelectProps) => {
  const { highlight, animationProps } = useHighlightAnimation<HTMLSelectElement>()

  const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange?.(event)
    highlight()
  }

  const labelText = label || placeholder

  return (
    <InputBase {...rest}>
      {() => (
        <Wrapper>
          <StyledSelect
            name={name}
            onChange={handleChange}
            value={value}
            defaultValue={value ? undefined : defaultValue ?? ''}
            variantSize={size}
            {...animationProps}
            {...rest}
          >
            {labelText && (
              <option value="" disabled>
                {labelText}
              </option>
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

const Wrapper = styled.div({ position: 'relative' })

const StyledChevronIcon = styled(ChevronIcon)({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
})

type SelectProps = { variantSize: Required<InputSelectProps['size']> }

const elementConfig = { shouldForwardProp: isValidProp }
const StyledSelect = styled(
  'select',
  elementConfig,
)<SelectProps>(({ variantSize }) => ({
  color: theme.colors.textPrimary,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: theme.space.md,
  paddingRight: theme.space.xxl,
  cursor: 'pointer',
  backgroundColor: theme.colors.translucent1,

  ...(variantSize === 'small' && {
    height: '2.5rem',
    fontSize: theme.fontSizes.md,
    borderRadius: theme.radius.xs,
  }),

  ...(variantSize === 'large' && {
    height: '3.5rem',
    fontSize: theme.fontSizes.xl,
    borderRadius: theme.radius.sm,
  }),

  '&:invalid, &:disabled': {
    color: theme.colors.textSecondary,
  },

  '&:disabled': {
    cursor: 'not-allowed',
  },
}))
