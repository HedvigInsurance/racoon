import styled from '@emotion/styled'
import { useId } from 'react'
import { Space } from 'ui'
import { Checkbox, CheckboxProps } from './Checkbox'

type Props = CheckboxProps & {
  label: string
}

export const CheckboxInput = ({ label, children, ...checkboxProps }: Props) => {
  const identifier = useId()

  return (
    <InputWrapper>
      <Space y={0.5}>
        <CheckboxHeader>
          <StyledLabel htmlFor={identifier}>{label}</StyledLabel>
          <Checkbox id={identifier} {...checkboxProps} />
        </CheckboxHeader>
        {children}
      </Space>
    </InputWrapper>
  )
}

const InputWrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.gray300,
  padding: theme.space[4],
  borderRadius: theme.radius.sm,
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
}))
