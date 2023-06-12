import styled from '@emotion/styled'
import { useTranslation } from 'next-i18next'
import { Button, CheckIcon, Heading, Space, Text, theme } from 'ui'

type Props = {
  company: string
  onClickConfirm: () => void
  onClickSkip: () => void
}

export const FetchInsurancePrompt = ({ company, onClickConfirm, onClickSkip }: Props) => {
  const { t } = useTranslation('purchase-form')

  const listItems = t('FETCH_INSURANCE_PROMPT_LIST').split('\n')

  return (
    <Space y={1.5}>
      <Content y={1.5}>
        <div>
          <Heading as="h3" variant="standard.18">
            {t('FETCH_INSURANCE_PROMPT_TITLE', { company })}
          </Heading>
          <Text color="textSecondary">{t('FETCH_INSURANCE_PROMPT_SUBTITLE')}</Text>
        </div>

        <List>
          {listItems.map((item) => (
            <ListItem key={item}>{item}</ListItem>
          ))}
        </List>
      </Content>

      <Space y={1}>
        <Space y={0.25}>
          <Button onClick={onClickConfirm}>{t('FETCH_INSURANCE_PROMPT_BUTTON_CONFIRM')}</Button>
          <Button variant="ghost" onClick={onClickSkip}>
            {t('FETCH_INSURANCE_PROMPT_BUTTON_SKIP')}
          </Button>
        </Space>

        <Text size="xxs" color="textSecondary" align="center" balance={true}>
          {t('FETCH_INSURANCE_PROMPT_DISCLAIMER')}
        </Text>
      </Space>
    </Space>
  )
}

const Content = styled(Space)({
  paddingInline: theme.space.xs,
})

const List = styled.ul({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
})

const ListItem = ({ children }: { children: string }) => {
  return (
    <StyledListItem>
      <CheckIcon size="1rem" />
      <Text>{children}</Text>
    </StyledListItem>
  )
}

const StyledListItem = styled.li({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
})
