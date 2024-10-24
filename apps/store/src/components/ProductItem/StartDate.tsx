import styled from '@emotion/styled'
import { InfoIcon } from 'ui/src/icons/InfoIcon'
import { Text, theme } from 'ui'
import { Tooltip } from '@/components/Tooltip/Tooltip'

type Props = {
  label: string
  tooltip?: string
}

export const StartDate = (props: Props) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <Wrapper>
      <SingleLineText color="textTranslucentSecondary" title={props.label}>
        {props.label}
      </SingleLineText>
      {props.tooltip && (
        <TooltipWrapper>
          <Tooltip message={props.tooltip}>
            <button onClick={handleClick} style={{ marginBottom: -2 }}>
              <InfoIcon color={theme.colors.textSecondary} />
            </button>
          </Tooltip>
        </TooltipWrapper>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: theme.space.xxs,
})

const SingleLineText = styled(Text)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const TooltipWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
})
