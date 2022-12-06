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
  backgroundColor: theme.colors.gray300,
  color: theme.colors.gray900,
  fontSize: theme.fontSizes[5],
  width: '100%',
  borderRadius: theme.radius.sm,
  display: 'flex',
  padding: `${theme.space[3]} ${theme.space[4]}`,
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
            {placeholder && <Placeholder value="">{placeholder}</Placeholder>}
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
