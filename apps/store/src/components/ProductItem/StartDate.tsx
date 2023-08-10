import { InfoIcon, Text, theme } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Tooltip } from './Tooltip'

type Props = {
  label: string
  tooltip: string
}

export const StartDate = (props: Props) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <SpaceFlex space={0.25} align="center">
      <Text color="textSecondary">{props.label}</Text>
      <Tooltip message={props.tooltip}>
        <button onClick={handleClick} style={{ marginBottom: -2 }}>
          <InfoIcon color={theme.colors.textSecondary} />
        </button>
      </Tooltip>
    </SpaceFlex>
  )
}
