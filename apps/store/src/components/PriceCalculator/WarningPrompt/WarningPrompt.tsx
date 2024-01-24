import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, InfoIcon, Space, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

type Props = {
  heading?: string
  message?: string
}

export const WarningPrompt = ({ heading, message }: Props) => {
  const { t } = useTranslation('purchase-form')

  return (
    <Wrapper>
      <Space y={1.5}>
        <SpaceFlex space={1} direction="vertical" align="center">
          <InfoIcon size="1.5rem" color={theme.colors.signalBlueElement} />
          <div>
            <Text>{heading}</Text>
            <Text color="textSecondary">{message}</Text>
          </div>
        </SpaceFlex>

        <Space y={0.25}>
          <Button>{t('PRICE_INTENT_WARNING_ACCEPT_BUTTON_LABEL')}</Button>
          <Button variant="ghost">{t('PRICE_INTENT_WARNING_EDIT_BUTTON_LABEL')}</Button>
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
