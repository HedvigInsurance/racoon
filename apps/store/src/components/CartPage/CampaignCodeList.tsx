import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { FormEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { CrossIcon } from 'ui'
import { TextField } from '@/components/TextField/TextField'
import { I18nNamespace } from '@/utils/l10n/types'
import { CartPageProps } from './CartPageProps.types'
import { useRedeemCampaign, useUnredeemCampaign } from './useCampaign'

const FORM_CAMPAIGN_CODE = 'campaignCode'

type Props = {
  cartId: string
  campaigns: CartPageProps['campaigns']
}

export const CampaignCodeList = ({ cartId, campaigns }: Props) => {
  const { t } = useTranslation(I18nNamespace.Cart)
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
        <UppercaseTextField
          name={FORM_CAMPAIGN_CODE}
          label={t('CAMPAIGN_CODE_INPUT_LABEL')}
          variant="small"
          disabled={loadingRedeem}
        />
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
                {item.displayName}
                <CrossIcon size={theme.fontSizes[1]} color={theme.colors.gray500} />
              </ChipButton>
            </form>
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
})

const UppercaseTextField = styled(TextField)({ textTransform: 'uppercase' })

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
