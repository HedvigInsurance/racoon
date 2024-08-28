import { ClaimSubclaimsNew } from '@hope/features/claims/new/ClaimSubclaimsNew'
import { ClaimDetails } from './Overview/ClaimDetails'

export const ClaimOverviewNew = () => {
  return (
    <>
      <ClaimDetails />
      <ClaimSubclaimsNew />
    </>
  )
}
