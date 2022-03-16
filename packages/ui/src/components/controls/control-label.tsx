import styled from '@emotion/styled'

export const ControlLabel = styled.div<{ disabled?: boolean }>`
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  font-family: ${(props) => props.theme.fonts.body};
  line-height: 20px;
  color: ${(props) => (props.disabled ? props.theme.colors.gray500 : props.theme.colors.gray900)};
`
