import styled from '@emotion/styled'
import { InputHTMLAttributes, useId } from 'react'
import { Space } from 'ui'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export const DateInput = ({ label, children, ...inputProps }: Props) => {
  const identifier = useId()

  return (
    <InputWrapper y={0.5}>
      <CheckboxHeader>
        <StyledLabel htmlFor={identifier}>{label}</StyledLabel>
        <StyledInput type="date" id={identifier} {...inputProps} />
      </CheckboxHeader>
      {children}
    </InputWrapper>
  )
}

const InputWrapper = styled(Space)(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  padding: theme.space[4],
  borderRadius: theme.radius.sm,
  width: '100%',
}))

const CheckboxHeader = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.space[3],
  justifyContent: 'space-between',
  alignItems: 'center',
}))

const StyledLabel = styled.label(({ theme }) => ({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[3],

  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',

  flex: 1,
}))

const StyledInput = styled.input(({ theme }) => ({
  fontFamily: theme.fonts.body,
  fontSize: theme.fontSizes[3],

  display: 'flex',
  alignItems: 'center',
}))
