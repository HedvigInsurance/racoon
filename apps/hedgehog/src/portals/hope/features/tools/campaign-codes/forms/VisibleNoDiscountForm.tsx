import {
  Button,
  Input,
  Label,
  SearchableDropdown,
  Spacing,
  TextDatePicker,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui'
import { DateRangeWrapper } from '@hope/features/tools/campaign-codes/forms/FreeMonthsForm'
import { PartnerDropdown } from '@hope/features/tools/campaign-codes/forms/PartnerDropdown'
import { useGetCodeTypeOptions } from '@hope/features/tools/campaign-codes/utils'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  AssignVoucherVisibleNoDiscount,
  FindPartnerCampaignsDocument,
  useAssignCampaignToPartnerVisibleNoDiscountMutation,
} from 'types/generated/graphql'

interface VisibleNoDiscountFormData {
  code: string
  partnerId: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validFrom?: any | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validUntil?: any | null
  codeType?: string | null
}

const initialFormData: VisibleNoDiscountFormData = {
  code: '',
  partnerId: '',
  validFrom: null,
  validUntil: null,
  codeType: null,
}

const formIsValid = (formData: VisibleNoDiscountFormData) => {
  const { partnerId, code } = formData

  return !(!partnerId || !code)
}

export const VisibleNoDiscountForm: React.FC = () => {
  const [formData, setFormData] =
    React.useState<VisibleNoDiscountFormData>(initialFormData)

  const [setPartnerVisibleNoDiscount, { loading }] =
    useAssignCampaignToPartnerVisibleNoDiscountMutation()

  const codeTypeOptions = useGetCodeTypeOptions()

  const reset = () => setFormData(initialFormData)

  const { confirm } = useConfirmDialog()

  return (
    <>
      <Label>Partner</Label>
      <PartnerDropdown
        loading={loading}
        onChange={(data) =>
          setFormData({
            ...formData,
            partnerId: data ? (data.value as string) : null,
          })
        }
        value={formData.partnerId ?? ''}
      />
      <Spacing top="small" />
      <Label>Code</Label>
      <Input
        value={formData.code}
        disabled={loading}
        onChange={({ currentTarget: { value: code } }) =>
          setFormData({ ...formData, code })
        }
        placeholder="Code"
      />
      <Spacing top="small" />
      <DateRangeWrapper>
        <div style={{ width: '100%', paddingRight: '1.0em' }}>
          <Label>Valid from</Label>
          <TextDatePicker
            withCurrentTime
            onChange={(validFrom) => setFormData({ ...formData, validFrom })}
            value={formData.validFrom}
            placeholder="Beginning of time"
          />
        </div>
        <div style={{ width: '100%', paddingLeft: '1.0em' }}>
          <Label>Valid to</Label>
          <TextDatePicker
            withCurrentTime
            onChange={(validUntil) => setFormData({ ...formData, validUntil })}
            value={formData.validUntil}
            placeholder="End of time"
          />
        </div>
      </DateRangeWrapper>
      <Spacing top="small" />
      <Label>Code Type</Label>
      <SearchableDropdown
        value={formData.codeType}
        placeholder="Code Type"
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData({
            ...formData,
            codeType: data ? (data.value as string) : null,
          })
        }
        noOptionsMessage={() => 'Option not found'}
        options={codeTypeOptions}
      />
      <Spacing top="small" />
      <div>
        <Button
          disabled={loading || !formIsValid(formData)}
          onClick={() => {
            confirm(`Create new campaign code "${formData.code}"?`).then(() => {
              toast.promise(
                setPartnerVisibleNoDiscount({
                  variables: {
                    request: formData as AssignVoucherVisibleNoDiscount,
                  },
                  refetchQueries: [{ query: FindPartnerCampaignsDocument }],
                }),
                {
                  loading: 'Creating campaign',
                  success: () => {
                    reset()
                    return 'Campaign created'
                  },
                  error: 'Could not create campaign',
                },
              )
            })
          }}
        >
          Create Campaign
        </Button>
      </div>
    </>
  )
}
