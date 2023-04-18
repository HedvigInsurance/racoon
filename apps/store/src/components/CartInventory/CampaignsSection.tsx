import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, useState } from 'react'
import { Button, CrossIconSmall, Heading, Text, theme } from 'ui'
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
  const handleSubmitCampaign: FormEventHandler<HTMLFormElement> = (event) => {
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

  const handleOpenChange = (open: boolean) => {
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
      <SpaceBetween>
        <Heading as="h3" variant="standard.18">
          {t('CAMPAIGN_CODE_HEADING')}
        </Heading>

        <Collapsible.Trigger asChild>
          <Switch checked={open} />
        </Collapsible.Trigger>
      </SpaceBetween>

      <CollapsibleContent>
        <div style={{ height: theme.space.sm }} />
        {content}
      </CollapsibleContent>
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

const slideDown = keyframes({
  '0%': {
    height: 0,
    opacity: 0,
  },
  '50%': {
    // custom property reference: https://www.radix-ui.com/docs/primitives/components/collapsible
    height: 'var(--radix-collapsible-content-height)',
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

const slideUp = keyframes({
  '0%': {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 1,
  },
  '50%': {
    height: 'var(--radix-collapsible-content-height)',
    opacity: 0,
  },
  '100%': {
    height: 0,
    opacity: 0,
  },
})

const CollapsibleContent = styled(Collapsible.Content)({
  '[data-state=open] &': {
    animation: `${slideDown} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
  '[data-state=closed] &': {
    animation: `${slideUp} 400ms cubic-bezier(0.65,0.05,0.36,1)`,
  },
})
