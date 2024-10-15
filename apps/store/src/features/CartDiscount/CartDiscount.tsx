import { useTranslation } from 'next-i18next'
import { type FormEvent } from 'react'
import { Text } from 'ui'
import { Discount } from '@/components/Discount/Discount'
import { type ShopSession } from '@/services/shopSession/ShopSession.types'
import { getDiscountsVisibility } from './CartDiscount.utils'
import { useCartDiscount } from './hooks/useCartDiscount'

const FORM_CAMPAIGN_CODE = 'campaignCode'

type Props = {
  shopSession: ShopSession
}

export function CartDiscount({ shopSession }: Props) {
  const { t } = useTranslation('cart')

  const {
    campaignCode,
    codeExplanation,
    isLoading,
    errorMessage,
    redeemCampaign,
    unredeemCampaign,
  } = useCartDiscount(shopSession)

  const { shouldShowDiscountForm, shouldShowToggle } = getDiscountsVisibility(shopSession)

  const redeem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const code = formData.get(FORM_CAMPAIGN_CODE)

    if (typeof code === 'string') {
      redeemCampaign(code)
    }
  }

  const unredeem = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    unredeemCampaign()
  }

  return (
    <Discount.Root defaultOpen={!!campaignCode} onOpenChange={(isOpen) => !isOpen && unredeem()}>
      <Discount.Header>
        <Text>{t('CAMPAIGN_CODE_HEADING')}</Text>

        {shouldShowToggle ? <Discount.Toggle /> : null}
      </Discount.Header>

      <Discount.Content>
        {campaignCode ? (
          <Discount.Code code={campaignCode} onSubmit={unredeem}>
            {codeExplanation}
          </Discount.Code>
        ) : null}

        {shouldShowDiscountForm ? (
          <Discount.Form onSubmit={redeem} loading={isLoading} errorMessage={errorMessage} />
        ) : null}
      </Discount.Content>
    </Discount.Root>
  )
}
