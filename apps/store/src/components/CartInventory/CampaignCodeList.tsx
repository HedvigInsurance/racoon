import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { FormEventHandler } from 'react'
import { CrossIcon, Text } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { CartCampaign } from './CartInventory.types'
import { useRedeemCampaign, useUnredeemCampaign } from './useCampaign'

const FORM_CAMPAIGN_CODE = 'campaignCode'

type Props = {
  cartId: string
  campaigns: Array<CartCampaign>
}

export const CampaignCodeList = ({ cartId, campaigns }: Props) => {
  const { t } = useTranslation('cart')
  const theme = useTheme()

  const [redeemCampaign, { loading: loadingRedeem }] = useRedeemCampaign({ cartId })
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
            disabled={loadingRedeem}
          />
          <AddDiscountButton>{t('CHECKOUT_ADD_DISCOUNT_BUTTON')}</AddDiscountButton>
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
                {item.code}
                <CrossIcon size={theme.fontSizes[1]} color={theme.colors.gray500} />
              </ChipButton>
            </form>

            <Text>{item.discountExplanation}</Text>
          </SpaceBetween>
        </li>
      ))}
    </ul>
  )
}

const SpaceBetween = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space[2],
}))

const UppercaseTextField = styled(TextField)({ textTransform: 'uppercase' })

const DiscountFormWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.space[2],
}))

const AddDiscountButton = styled.button(({ theme }) => ({
  textAlign: 'center',
  backgroundColor: theme.colors.green50,
  padding: `${theme.space[2]} ${theme.space[5]}`,
  borderRadius: `${theme.radius.sm}px`,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(30px)',
  whiteSpace: 'nowrap',
}))

const ChipButton = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space[1],
  borderRadius: theme.radius.xs,
  backgroundColor: theme.colors.gray200,
  color: theme.colors.gray900,
  fontSize: theme.fontSizes[1],
  textTransform: 'uppercase',
  paddingTop: theme.space[1],
  paddingBottom: theme.space[1],
  paddingLeft: theme.space[2],
  paddingRight: theme.space[2],

  ':disabled': {
    opacity: 0.6,
  },
}))
