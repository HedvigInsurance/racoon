import { CalculatingInput, Flex, Input, Label } from '@hedvig-ui'
import {
  StyledCalculationRow,
  StyledOperator,
} from '@hope/features/claims/claim-details/SubclaimPaymentOrders'
import * as React from 'react'
import { useEffect } from 'react'
import {
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'
import { PaymentOrderFormValues } from './UpsertPaymentOrder'

type Props<TFormValues extends FieldValues> = {
  register: UseFormRegister<PaymentOrderFormValues>
  setValue: UseFormSetValue<PaymentOrderFormValues>
  watch: UseFormWatch<TFormValues>
  currency: string
  defaultDeductible: number
}

export const ValueCalculationRow = <TFormValues extends FieldValues>({
  register,
  setValue,
  watch,
  currency,
  // defaultDeductible,
}: Props<TFormValues>) => {
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'beforeAmount' || name === 'deductible') {
        const before = isNaN(+value.beforeAmount) ? 0 : +value.beforeAmount
        const deductible = isNaN(+value.deductible) ? 0 : +value.deductible
        setValue('amount', +Number(before - deductible).toFixed(2))
      }
    })
    return () => subscription.unsubscribe()
  }, [setValue, watch])
  return (
    <StyledCalculationRow>
      <CalculatingInput
        {...register('beforeAmount')}
        placeholder="Enter amount"
        label="Valued amount"
        onChange={(value) => {
          setValue('beforeAmount', value)
        }}
        affix={{ content: currency }}
      />

      <StyledOperator>-</StyledOperator>

      <div>
        <Flex gap="small" align="center" justify="space-between">
          <Label>Deductible</Label>
          {/* {!!defaultDeductible && defaultDeductible != watch('deductible') && (
            <Popover
              contents={`Use deductible from claim type (${defaultDeductible})`}
            >
              <InfoTag
                onClick={() => setValue('deductible', +defaultDeductible)}
                style={{ marginBottom: '0.4rem', cursor: 'pointer' }}
                status="info"
              >
                Autofill
              </InfoTag>
            </Popover>
          )} */}
        </Flex>
        <CalculatingInput
          {...register('deductible')}
          placeholder="Enter deductible"
          onChange={(value) => setValue('deductible', value)}
          affix={{ content: currency }}
        />
      </div>

      <StyledOperator>=</StyledOperator>

      <div>
        <Flex gap="small" align="center" justify="space-between">
          <Label>Paid amount</Label>
        </Flex>
        <Input {...register('amount')} disabled affix={{ content: currency }} />
      </div>
    </StyledCalculationRow>
  )
}
