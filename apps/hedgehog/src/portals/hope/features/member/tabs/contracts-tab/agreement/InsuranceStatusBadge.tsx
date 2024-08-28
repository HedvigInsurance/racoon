import styled from '@emotion/styled'

export const InsuranceStatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  font-size: 0.8rem;
  padding: 0.25rem 0.8rem;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'ACTIVE':
        return theme.activeInsuranceBackground
      case 'PENDING':
        return theme.pendingInsuranceBackground
      case 'TERMINATED':
        return theme.terminatedInsuranceBackground
    }
    return theme.mutedBackground
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'ACTIVE':
        return theme.activeInsuranceForeground
      case 'PENDING':
        return theme.pendingInsuranceForeground
      case 'TERMINATED':
        return theme.terminatedInsuranceForeground
    }
    return theme.mutedText
  }};
  text-transform: capitalize;
  border-radius: 1000px;
`
