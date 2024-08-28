import { useMemo } from 'react'
import { convertEnumToSentence } from '@hedvig-ui'
import { Dropdown } from '@hedvig-ui/redesign'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import {
  ClaimLocation,
  Market,
  MarketClaimLocations,
} from '@hope/features/config/constants'
import { useSetClaimLocation } from '@hope/features/claims/hooks/useSetClaimLocation'

export const ClaimLocationDropdownNew = () => {
  const { claimId, location: selectedLocation, member } = useClaim()
  const { setLocation } = useSetClaimLocation()

  const market = member.contractMarketInfo?.market
  const locationOptions = useMemo(
    () =>
      market
        ? MarketClaimLocations[market as Market]
        : Object.values(ClaimLocation),
    [market],
  )

  return (
    <Dropdown
      label="Location"
      options={locationOptions.map((location) => ({
        value: location,
        label: convertEnumToSentence(location),
        action: () => setLocation(claimId, location),
        selected: location === selectedLocation,
      }))}
    />
  )
}
