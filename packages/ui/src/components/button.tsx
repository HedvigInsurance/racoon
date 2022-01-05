import { colorsV3 } from '@hedviginsurance/brand'
import styled from '@emotion/styled'

export const Button = styled.button`
  appearance: none;
  border: 0;
  background-color: ${colorsV3.purple500};
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  line-height: 1.5rem;
  cursor: pointer;

  &:hover {
    background-color: ${colorsV3.purple800};
  }

  &:disabled {
    color: ${colorsV3.gray500};
    background-color: ${colorsV3.gray300};
  }
`
