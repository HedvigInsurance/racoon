import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, InfoIcon, Space, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import type { PriceIntentWarning } from '@/services/graphql/generated'

type Props = {
  onClickConfirm: () => void
  onClickEdit: () => void
} & PriceIntentWarning

export const WarningPrompt = ({ header, message, onClickConfirm, onClickEdit }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <Wrapper>
      <Space y={1.5}>
        <SpaceFlex space={1} direction="vertical" align="center">
          <InfoIcon size="1.5rem" color={theme.colors.signalBlueElement} />
          <div>
            <Text balance={true}>{header}</Text>
            <Text color="textSecondary" balance={true}>
              {message}
            </Text>
          </div>
        </SpaceFlex>

        <Space y={0.25}>
          <Button onClick={onClickConfirm} fullWidth={true}>
            {t('PRICE_INTENT_WARNING_ACCEPT_BUTTON_LABEL')}
          </Button>
          <Button onClick={onClickEdit} variant="ghost" fullWidth={true}>
            {t('PRICE_INTENT_WARNING_EDIT_BUTTON_LABEL')}
          </Button>
        </Space>
      </Space>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  paddingBlock: `${theme.space.xl} ${theme.space.md}`,
  paddingInline: theme.space.md,
  textAlign: 'center',
})
