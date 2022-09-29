import styled from '@emotion/styled'
import { ChevronIcon, InputBase, InputBaseProps } from 'ui'

const Wrapper = styled.div(() => ({
  position: 'relative',
}))

const StyledChevronIcon = styled(ChevronIcon)(() => ({
  position: 'absolute',
  top: '50%',
  right: '1.25rem',
  transform: 'translateY(-50%)',
}))

const StyledSelect = styled.select(({ theme }) => ({
  backgroundColor: theme.colors.white,
  color: theme.colors.gray900,
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  padding: '0 1rem',
  width: '100%',
  borderRadius: '0.5rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  display: 'flex',
  alignItems: 'center',
  height: '3.5rem',

  ':focus, :hover': {
    outline: '2px solid transparent',
    outlineOffset: '2px',
    borderColor: theme.colors.gray900,
  },

  ':disabled': {
    backgroundColor: theme.colors.gray300,
    borderColor: theme.colors.gray300,
    color: theme.colors.gray500,
    cursor: 'not-allowed',
  },

  borderColor: theme.colors.gray300,
}))

type InputSelectProps = InputBaseProps & {
  name: string
  options: Array<{ name: string; value: string }>
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
  ...rest
}: InputSelectProps) => {
  return (
    <InputBase {...rest}>
      {() => (
        <Wrapper>
          <StyledSelect
            name={name}
            onChange={onChange}
            value={value}
            defaultValue={defaultValue}
            {...rest}
          >
            {placeholder && <option value="">{placeholder}</option>}
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
