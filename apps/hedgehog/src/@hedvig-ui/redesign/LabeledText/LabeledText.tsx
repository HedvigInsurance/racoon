import { HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import { InputOrDropdownWrapper } from '../InputOrDropdown'
import { colors } from '../palette'

type DataProps = {
  label: string
}

type StyleProps = {
  customSize: 'small' | 'medium' | 'large'
}

export type LabeledTextProps = DataProps &
  Partial<StyleProps> &
  HTMLAttributes<HTMLDivElement>

export const LabeledText = (props: LabeledTextProps) => {
  const { label, children, customSize = 'medium', ...rest } = props
  return (
    <StyledLabeledText customSize={customSize} {...rest}>
      <span className="label">{label}</span>
      <div className="value">{children}</div>
    </StyledLabeledText>
  )
}

const StyledLabeledText = styled(InputOrDropdownWrapper)<StyleProps>`
  background-color: transparent;
  border-color: transparent;
  padding-left: 4px;
  flex-direction: column;
  align-items: flex-start;

  .label {
    position: initial;
    color: ${colors.textPrimary};
  }

  .value {
    color: ${colors.textSecondary};
  }
`
