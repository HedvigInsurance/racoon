import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, useState } from 'react'
import { Button, CrossIconSmall, Heading, Space, Text, theme } from 'ui'
import { Switch } from '@/components/Switch'
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

  const [open, setOpen] = useState(campaigns.length > 0)

  const handleOpenChange = async (open: boolean) => {
    setOpen(open)
    if (!open) {
      const activeCampaign = campaigns[0] as CartCampaign | undefined
      if (activeCampaign) {
        unredeemCampaign(activeCampaign.id)
      }
    }
  }

  const form = (
    <form onSubmit={handleSubmitCampaign}>
      <DiscountFormWrapper>
        <UppercaseTextField
          name={FORM_CAMPAIGN_CODE}
          label={t('CAMPAIGN_CODE_INPUT_LABEL')}
          variant="small"
          warning={!!errorMessage}
          message={errorMessage}
          required={true}
        />
        <Button variant="primary-alt" loading={loadingRedeem}>
          {t('CHECKOUT_ADD_DISCOUNT_BUTTON')}
        </Button>
      </DiscountFormWrapper>
    </form>
  )

  const campaignList = (
    <ul>
      {campaigns.map((item) => (
        <li key={item.id}>
          <SpaceBetween>
            <form onSubmit={handleSubmitUnredeemCampaign(item.id)}>
              <ChipButton disabled={loadingUnredeenCampaign}>
                <Text as="span" size="xs">
                  {item.code}
                </Text>
                <CrossIconSmall color={theme.colors.textTertiary} />
              </ChipButton>
            </form>

            <Text>{item.discountExplanation}</Text>
          </SpaceBetween>
        </li>
      ))}
    </ul>
  )

  const content = campaigns.length === 0 ? form : campaignList

  return (
    <Collapsible.Root open={open} onOpenChange={handleOpenChange}>
      <Space y={1}>
        <SpaceBetween>
          <Heading as="h3" variant="standard.18">
            {t('CAMPAIGN_CODE_HEADING')}
          </Heading>

          <Collapsible.Trigger asChild>
            <Switch checked={open} />
          </Collapsible.Trigger>
        </SpaceBetween>

        <Collapsible.Content>{content}</Collapsible.Content>
      </Space>
    </Collapsible.Root>
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
