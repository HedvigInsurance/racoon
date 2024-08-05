import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { sprinkles, Text, xStack } from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { Switch } from '@/components/Switch'
import { AddCampaignForm } from './AddCampaignForm/AddCampaignForm'
import { AddedCampaignForm } from './AddedCampaignForm'

type Props = {
  defaultActive?: boolean
  discount?: {
    code: string
    explanation: string
  }
  onAdd: (campaignCode: string) => void
  loadingAdd: boolean
  onRemove: () => void
  loadingRemove: boolean
  errorMessage?: string
}

export const DiscountField = (props: Props) => {
  const { t } = useTranslation('cart')
  const [active, setActive] = useState(props.defaultActive ?? false)

  const handleOpenChange = (open: boolean) => {
    setActive(open)
    if (!open && props.discount) {
      props.onRemove()
    }
  }

  return (
    <Collapsible.Root open={active} onOpenChange={handleOpenChange}>
      <div
        className={xStack({
          alignItems: 'center',
          gap: 'md',
          paddingInline: 'xxs',
          justifyContent: 'space-between',
        })}
      >
        <Text>{t('CAMPAIGN_CODE_HEADING')}</Text>
        <Collapsible.Trigger asChild={true}>
          <Switch checked={active} />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        {/*
        GOTCHA: padding has to be set on inner element, otherwise animation jumps
        because it does not measure Collapsible.Content height correctly
        */}
        <div className={sprinkles({ paddingTop: 'md' })}>
          {props.discount ? (
            <AddedCampaignForm
              campaignCode={props.discount.code}
              onRemove={props.onRemove}
              loading={props.loadingRemove}
            >
              {props.discount.explanation}
            </AddedCampaignForm>
          ) : (
            <AddCampaignForm
              onAdd={props.onAdd}
              loading={props.loadingAdd}
              errorMessage={props.errorMessage}
            />
          )}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
