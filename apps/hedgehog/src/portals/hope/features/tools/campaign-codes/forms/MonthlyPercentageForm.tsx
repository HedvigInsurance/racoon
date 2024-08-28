import {
  Button,
  convertEnumOrSentenceToTitle,
  Input,
  Label,
  SearchableDropdown,
  Spacing,
  TextDatePicker,
  useConfirmDialog,
} from '@hedvig-ui'
import { PartnerDropdown } from '@hope/features/tools/campaign-codes/forms/PartnerDropdown'
import {
  useGetCodeTypeOptions,
  numberOfMonthsOptions,
  percentageDiscountOptions,
} from '@hope/features/tools/campaign-codes/utils'
import { useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  AssignVoucherPercentageDiscount,
  DiscountScope,
  FindPartnerCampaignsDocument,
  useAssignCampaignToPartnerPercentageDiscountMutation,
} from 'types/generated/graphql'
import { DateRangeWrapper } from './FreeMonthsForm'
import { InsuranceType } from '@hope/features/config/constants'
import Select from 'react-select'

const initialFormData: MonthlyPercentageFormData = {
  code: '',
  partnerId: null,
  numberOfMonths: null,
  percentageDiscount: null,
  validFrom: null,
  validUntil: null,
  codeType: null,
  discountScope: DiscountScope.InsuranceTypes,
  insuranceTypes: [],
}

const formLooksGood = (formData: MonthlyPercentageFormData) => {
  const {
    partnerId,
    code,
    percentageDiscount,
    numberOfMonths,
    insuranceTypes,
  } = formData

  return !(
    !partnerId ||
    !numberOfMonths ||
    !code ||
    !percentageDiscount ||
    insuranceTypes.length === 0
  )
}

interface MonthlyPercentageFormData {
  partnerId: string | null
  numberOfMonths: number | null
  percentageDiscount: number | null
  code: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validFrom?: any | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validUntil?: any | null
  codeType?: string | null
  discountScope: DiscountScope
  insuranceTypes: string[]
}

export const MonthlyPercentageForm: React.FC = () => {
  const [formData, setFormData] =
    useState<MonthlyPercentageFormData>(initialFormData)

  const [setPartnerPercentageDiscount, { loading }] =
    useAssignCampaignToPartnerPercentageDiscountMutation()

  const codeTypeOptions = useGetCodeTypeOptions()

  const { confirm } = useConfirmDialog()

  return (
    <>
      <Label>Partner</Label>
      <PartnerDropdown
        loading={loading}
        onChange={(data) =>
          setFormData((prevState) => ({
            ...prevState,
            partnerId: data ? (data.value as string) : null,
          }))
        }
        value={formData.partnerId ?? ''}
      />
      <Spacing top="small" />
      <Label>Code</Label>
      <Input
        value={formData.code}
        disabled={loading}
        onChange={({ currentTarget: { value: code } }) =>
          setFormData((prevState) => ({ ...prevState, code }))
        }
        placeholder="Code"
      />
      <Spacing top="small" />
      <DateRangeWrapper>
        <div style={{ width: '100%', paddingRight: '1.0em' }}>
          <Label>Valid from</Label>
          <TextDatePicker
            withCurrentTime
            onChange={(validFrom) =>
              setFormData((prevState) => ({ ...prevState, validFrom }))
            }
            value={formData.validFrom}
            placeholder="Beginning of time"
          />
        </div>
        <div style={{ width: '100%', paddingLeft: '1.0em' }}>
          <Label>Valid to</Label>
          <TextDatePicker
            withCurrentTime
            onChange={(validUntil) =>
              setFormData((prevState) => ({ ...prevState, validUntil }))
            }
            value={formData.validUntil}
            placeholder="End of time"
          />
        </div>
      </DateRangeWrapper>
      <Spacing top="small" />
      <Label>Percentage discount</Label>
      <SearchableDropdown
        value={formData.percentageDiscount}
        placeholder="How much percentage discount?"
        isLoading={loading}
        isClearable={true}
        onChange={(data) => {
          setFormData((prevState) => ({
            ...prevState,
            percentageDiscount: data ? (data.value as number) : null,
          }))
        }}
        noOptionsMessage={() => 'Option not found'}
        options={percentageDiscountOptions}
      />
      <Spacing top="small" />
      <Label>Months</Label>
      <SearchableDropdown
        value={formData.numberOfMonths}
        placeholder="How many months?"
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData((prevState) => ({
            ...prevState,
            numberOfMonths: data ? (data.value as number) : null,
          }))
        }
        noOptionsMessage={() => 'Option not found'}
        options={numberOfMonthsOptions}
      />
      <Spacing top="small" />
      <Label>Code Type</Label>
      <SearchableDropdown
        value={formData.codeType}
        placeholder="Code Type"
        isLoading={loading}
        isClearable={true}
        onChange={(data) =>
          setFormData((prevState) => ({
            ...prevState,
            codeType: data ? (data.value as string) : null,
          }))
        }
        noOptionsMessage={() => 'Option not found'}
        options={codeTypeOptions}
      />
      <Spacing top="small" />
      <Label>Eligible Insurance Types</Label>
      <Select
        closeMenuOnSelect={false}
        isMulti
        name="colors"
        options={Object.values(InsuranceType).map((value) => ({
          value,
          label: convertEnumOrSentenceToTitle(value),
        }))}
        onChange={(newValues) =>
          setFormData((prevState) => ({
            ...prevState,
            insuranceTypes: newValues.map(({ value }) => value),
          }))
        }
      />
      <Spacing top="small" />
      <div>
        <Button
          disabled={loading || !formLooksGood(formData)}
          onClick={() => {
            confirm(`Create new campaign code "${formData.code}"?`).then(() => {
              toast.promise(
                setPartnerPercentageDiscount({
                  variables: {
                    request: {
                      ...formData,
                      percentageDiscount: String(formData.percentageDiscount),
                      numberOfMonths: String(formData.numberOfMonths),
                    } as unknown as AssignVoucherPercentageDiscount,
                  },
                  refetchQueries: [{ query: FindPartnerCampaignsDocument }],
                }),
                {
                  loading: 'Creating campaign',
                  success: 'Campaign created',
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
