import { type FormEvent } from 'react'
import { Discount } from '@/components/ProductCard/Discount/Discount'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { useDiscount } from './hooks/useDiscount'

const FORM_CAMPAIGN_CODE = 'campaignCode'

type Props = {
  shopSession: ShopSession
}

export function CartDiscount({ shopSession }: Props) {
  const {
    campaignCode,
    codeExplanation,
    isLoading,
    errorMessage,
    redeemCampaign,
    unredeemCampaign,
  } = useDiscount(shopSession)

  const redeem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const code = formData.get(FORM_CAMPAIGN_CODE)

    if (typeof code === 'string') {
      redeemCampaign(code)
    }
  }

  const unredeem = (event?: FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault()
    }

    unredeemCampaign()
  }

  return (
    <Discount.Root defaultOpen={!!campaignCode} onOpenChange={(isOpen) => !isOpen && unredeem()}>
      {campaignCode ? (
        <Discount.Code code={campaignCode} onSubmit={unredeem}>
          {codeExplanation}
        </Discount.Code>
      ) : (
        <Discount.Form onSubmit={redeem} loading={isLoading} errorMessage={errorMessage} />
      )}
    </Discount.Root>
  )
}
