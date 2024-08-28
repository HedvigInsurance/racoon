'use client'

import { ComponentProps, useState } from 'react'
import { switchCardStyles, switchStyles } from './Switch.css'

type SwitchProps = {
  active: boolean
} & ComponentProps<'div'>

export const Switch = (props: SwitchProps) => {
  const { active, ...rest } = props
  return (
    <div
      className={`${switchStyles.base} ${active ? switchStyles.active : ''}`}
      {...rest}
    />
  )
}

export const SwitchCard = (
  props: { label: string; active: boolean } & ComponentProps<'div'>,
) => {
  const { label, active, ...rest } = props
  return (
    <div
      className={`${switchCardStyles.base} ${active ? switchCardStyles.active : ''}`}
      {...rest}
    >
      <span>{label}</span>
      <Switch active={active} />
    </div>
  )
}

export const SwitchCardInput = ({
  label,
  name,
  defaultActive,
}: {
  label: string
  name: string
  defaultActive?: boolean
}) => {
  const [active, setActive] = useState(defaultActive ?? false)
  return (
    <>
      <SwitchCard
        label={label}
        active={active}
        onClick={() => setActive((prev) => !prev)}
      />
      <input
        type="checkbox"
        style={{ display: 'none' }}
        name={name}
        checked={active}
        readOnly
      />
    </>
  )
}
