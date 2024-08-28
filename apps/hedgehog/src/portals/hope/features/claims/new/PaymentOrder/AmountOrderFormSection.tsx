import { RefObject, useCallback, useEffect, useState } from 'react'
import { Grid, Input } from '@hedvig-ui/redesign'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { PaymentOrderFormSection } from './ClaimPaymentOrderFormNew'
import { theme } from '@hedvig-ui/redesign/theme'

export const AmountOrderFormSection: PaymentOrderFormSection = {
  Component: FormSection,
  extractPayload,
}

function FormSection({ formRef }: { formRef: RefObject<HTMLFormElement> }) {
  const currency = useClaim().preferredCurrency!

  const [amount, setAmount] = useState(0)

  const updateAmount = useCallback(() => {
    const form = formRef.current
    if (!form) return

    const totals = extractPayload(new FormData(form), { currency })
    setAmount(totals.amount.amount)
  }, [formRef, currency])

  useEffect(() => {
    updateAmount()
  }, [updateAmount])

  return (
    <Grid templateColumns={'1fr 2rem 1fr 2rem 1fr'} gap="small">
      <Input
        type="number"
        name="total"
        label="Valued amount"
        defaultValue={0}
        step=".01"
        required={true}
        affix={{
          content: currency,
        }}
        onChange={updateAmount}
      />
      <div style={{ margin: 'auto', fontSize: theme.fontSizes.xl }}>–</div>
      <Input
        type="number"
        name="deductible"
        label="Deductible"
        defaultValue={0}
        min={0}
        step=".01"
        required={true}
        affix={{
          content: currency,
        }}
        onChange={updateAmount}
      />
      <div style={{ margin: 'auto', fontSize: theme.fontSizes.xl }}>=</div>
      <Input
        disabled
        label="Paid amount"
        value={amount}
        affix={{ content: currency }}
        readOnly
      />
    </Grid>
  )
}

function extractPayload(data: FormData, { currency }: { currency: string }) {
  let total = parseFloat(data.get('total')!.toString())
  let deductible = parseFloat(data.get('deductible')!.toString())
  if (isNaN(total)) {
    total = 0
  }
  if (isNaN(deductible)) {
    deductible = 0
  }

  const payoutAmount = total - deductible

  return {
    amount: {
      amount: +Number(payoutAmount).toFixed(2),
      currency,
    },
    deductible: {
      amount: +Number(deductible).toFixed(2),
      currency,
    },
  }
}
