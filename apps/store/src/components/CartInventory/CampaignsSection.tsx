import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { Button, CrossIcon, Text, theme } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { CartCampaign } from './CartInventory.types'
import { useRedeemCampaign, useUnredeemCampaign } from './useCampaign'

const FORM_CAMPAIGN_CODE = 'campaignCode'

type Props = {
  cartId: string
  campaigns: Array<CartCampaign>
}

export const CampaignsSection = ({ cartId, campaigns }: Props) => {
  const { t } = useTranslation('cart')
  const theme = useTheme()

  const [redeemCampaign, { loading: loadingRedeem, errorMessage }] = useRedeemCampaign({ cartId })
  const handleSubmitCampaign: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const code = formData.get(FORM_CAMPAIGN_CODE)
    if (typeof code === 'string') {
      redeemCampaign(code.toUpperCase())
    }
  }

  const [unredeemCampaign, { loading: loadingUnredeenCampaign }] = useUnredeemCampaign({ cartId })
  const handleSubmitUnredeemCampaign = (campaignId: string): FormEventHandler => {
    return (event) => {
      event.preventDefault()
      unredeemCampaign(campaignId)
    }
  }

  if (campaigns.length === 0) {
    return (
      <form onSubmit={handleSubmitCampaign}>
        <DiscountFormWrapper>
          <UppercaseTextField
            name={FORM_CAMPAIGN_CODE}
            label={t('CAMPAIGN_CODE_INPUT_LABEL')}
            variant="small"
            warning={!!errorMessage}
            message={errorMessage}
          />
          <Button variant="primary-alt" loading={loadingRedeem}>
            {t('CHECKOUT_ADD_DISCOUNT_BUTTON')}
          </Button>
        </DiscountFormWrapper>
      </form>
    )
  }

  return (
    <ul>
      {campaigns.map((item) => (
        <li key={item.id}>
          <SpaceBetween>
            <form onSubmit={handleSubmitUnredeemCampaign(item.id)}>
              <ChipButton disabled={loadingUnredeenCampaign}>
                <Text as="span" size="xs">
                  {item.code}
                </Text>
                <CrossIcon size={theme.fontSizes.sm} color={theme.colors.gray500} />
              </ChipButton>
            </form>

            <Text>{item.discountExplanation}</Text>
          </SpaceBetween>
        </li>
      ))}
    </ul>
  )
}

const SpaceBetween = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.xs,
})

const UppercaseTextField = styled(TextField)({ textTransform: 'uppercase' })

const DiscountFormWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr minmax(33%, min-content)',
  gap: theme.space.xs,
})

const ChipButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  borderRadius: theme.radius.xs,
  backgroundColor: theme.colors.gray200,
  textTransform: 'uppercase',
  paddingTop: theme.space.xxs,
  paddingBottom: theme.space.xxs,
  paddingLeft: theme.space.xs,
  paddingRight: theme.space.xs,
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: `0 0 0 1px ${theme.colors.gray1000}`,
  },

  ':disabled': {
    opacity: 0.6,
  },
})
