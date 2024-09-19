import type { ReactNode } from 'react'
import { useId } from 'react'
import { Space, useHighlightAnimation } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { Switch, type SwitchProps } from '@/components/Switch'
import { wrapper, checkboxHeader, labelText } from './ToggleCard.css'

type Props = SwitchProps & {
  label: string
  Icon?: ReactNode
}

export const ToggleCard = ({
  id,
  label,
  children,
  onCheckedChange,
  Icon,
  ...checkboxProps
}: Props) => {
  const { highlight, animationProps } = useHighlightAnimation<HTMLDivElement>()
  const backupId = useId()
  const identifier = id || backupId

  const handleCheckedChange = (checked: boolean) => {
    highlight()
    onCheckedChange?.(checked)
  }

  return (
    <div className={wrapper} {...animationProps}>
      <Space y={0.5}>
        <div className={checkboxHeader}>
          <SpaceFlex align="center" space={0.5}>
            {Icon}
            <label className={labelText} htmlFor={identifier}>
              {label}
            </label>
          </SpaceFlex>
          <Switch id={identifier} onCheckedChange={handleCheckedChange} {...checkboxProps} />
        </div>
        {children}
      </Space>
    </div>
  )
}
