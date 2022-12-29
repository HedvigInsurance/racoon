import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { ChangeEventHandler } from 'react'
import { ChevronIcon, InputBase, InputBaseProps } from 'ui'
import { useHighlightAnimation } from '@/utils/useHighlightAnimation'

const Wrapper = styled.div(() => ({
  position: 'relative',
}))

const StyledChevronIcon = styled(ChevronIcon)(() => ({
  position: 'absolute',
  top: '50%',
  right: '1.125rem',
  transform: 'translateY(-50%)',
}))

const StyledSelect = styled(motion.select)(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  color: theme.colors.gray900,
  fontSize: theme.fontSizes[5],
  width: '100%',
  borderRadius: theme.radius.sm,
  padding: `${theme.space[2]} ${theme.space[4]}`,

  '&:hover': {
    cursor: 'pointer',
  },

  '&:focus-visible': {
    boxShadow: `0 0 0 2px ${theme.colors.textPrimary}`,
  },
}))

const Placeholder = styled.option(({ theme }) => ({
  color: theme.colors.gray500,
}))

type InputSelectProps = InputBaseProps & {
  name: string
  options: ReadonlyArray<{ name: string; value: string }>
  value?: string
  defaultValue?: string
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
}

export const InputSelect = ({
  options,
  name,
  onChange,
  value,
  defaultValue,
  placeholder,
  label,
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
        <Wrapper>
          <StyledSelect
            name={name}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...rest}
            {...animationProps}
          >
            {labelText && (
              <Placeholder value="" disabled selected>
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
