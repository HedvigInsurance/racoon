import styled from '@emotion/styled'
import type { FormEventHandler } from 'react'
import { CrossIconSmall } from 'ui/src/icons/CrossIconSmall'
import { Text, theme } from 'ui'

type Props = {
  onRemove: () => void
  loading: boolean
  campaignCode: string
  children: string
}

export const AddedCampaignForm = (props: Props) => {
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    props.onRemove()
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <ChipButton disabled={props.loading}>
          <Text as="span" size="xs">
            {props.campaignCode}
          </Text>
          <CrossIconSmall color={theme.colors.textTertiary} />
        </ChipButton>
      </form>
      <Text>{props.children}</Text>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.space.xs,
})

const ChipButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
  borderRadius: theme.radius.xxs,
  backgroundColor: theme.colors.gray200,
  textTransform: 'uppercase',
  paddingBlock: theme.space.xxs,
  paddingInline: theme.space.xs,
  cursor: 'pointer',

  ':focus-visible': {
    boxShadow: theme.shadow.focus,
  },

  ':disabled': {
    opacity: 0.8,
    cursor: 'not-allowed',
  },
})
