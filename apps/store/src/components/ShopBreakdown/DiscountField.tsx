import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import { Text, theme } from 'ui'
import * as Collapsible from '@/components/Collapsible'
import { Switch } from '@/components/Switch'
import { AddCampaignForm } from './AddCampaignForm'
import { AddedCampaignForm } from './AddedCampaignForm'

type Props = {
  defaultActive?: boolean
  campaign?: {
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
    if (!open && props.campaign) {
      props.onRemove()
    }
  }

  return (
    <Collapsible.Root open={active} onOpenChange={handleOpenChange}>
      <Wrapper>
        <Text>{t('CAMPAIGN_CODE_HEADING')}</Text>
        <Collapsible.Trigger asChild={true}>
          <Switch checked={active} />
        </Collapsible.Trigger>
      </Wrapper>
      <Collapsible.Content style={{ paddingTop: theme.space.md }}>
        {props.campaign ? (
          <AddedCampaignForm
            campaignCode={props.campaign.code}
            onRemove={props.onRemove}
            loading={props.loadingRemove}
          >
            {props.campaign.explanation}
          </AddedCampaignForm>
        ) : (
          <AddCampaignForm
            onAdd={props.onAdd}
            loading={props.loadingAdd}
            errorMessage={props.errorMessage}
          />
        )}
      </Collapsible.Content>
    </Collapsible.Root>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  columnGap: theme.space.md,
  paddingInline: theme.space.xxxs,
})
