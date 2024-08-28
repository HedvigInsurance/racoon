import { usePartnerCampaignOwners } from '@hope/features/tools/campaign-codes/hooks/use-get-partner-campaign-owners'
import { mapCampaignOwners } from '@hope/features/tools/campaign-codes/utils'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import { useCreateCampaignPartnerMutation } from 'types/generated/graphql'
import { CreatableDropdown, SelectOption } from '@hedvig-ui'

export const PartnerDropdown: React.FC<{
  onChange: (data: SelectOption | null) => void
  value: string
  loading?: boolean
  creatable?: boolean
  placeholder?: string
}> = ({ onChange, value, loading = false, placeholder = 'Which partner?' }) => {
  const [partnerCampaignOwners, { refetch }] = usePartnerCampaignOwners()
  const [createCampaignPartner] = useCreateCampaignPartnerMutation()

  return (
    <CreatableDropdown
      formatCreateLabel={(optionValue) => (
        <span>
          Create partner "<b>{optionValue}</b>"?
        </span>
      )}
      onCreateOption={(option) => {
        if (!option) {
          return
        }

        toast
          .promise(
            createCampaignPartner({
              variables: {
                partnerId: option.toLowerCase().trim().replace(' ', '_'),
                partnerName: option,
              },
            }),
            {
              loading: 'Creating partner...',
              success: 'Partner created',
              error: 'Could not create partner',
            },
          )
          .then(() => refetch())
      }}
      value={
        value
          ? {
              value,
              label: value,
            }
          : null
      }
      placeholder={placeholder}
      isLoading={loading}
      isClearable={true}
      onChange={onChange}
      noOptionsMessage={() => 'No partners found'}
      options={mapCampaignOwners(partnerCampaignOwners)}
    />
  )
}
