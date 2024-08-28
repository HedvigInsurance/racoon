import { useMemo } from 'react'
import { convertEnumToSentence, Dropdown, DropdownOption } from '@hedvig-ui'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import {
  ClaimLocation,
  Market,
  MarketClaimLocations,
} from '@hope/features/config/constants'
import { useSetClaimLocation } from '@hope/features/claims/hooks/useSetClaimLocation'

export const ClaimLocationDropdown = () => {
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
    <Dropdown placeholder="Location">
      {locationOptions.map((location) => (
        <DropdownOption
          key={location}
          onClick={() => setLocation(claimId, location)}
          selected={location === selectedLocation}
        >
          {convertEnumToSentence(location)}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}
