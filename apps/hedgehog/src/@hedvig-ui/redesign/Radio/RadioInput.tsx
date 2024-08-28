import { ComponentProps } from 'react'
import { label, radio } from '@hedvig-ui/redesign/Radio/RadioInput.css'

type RadioProps = {
  label: string
} & Omit<ComponentProps<'input'>, 'type'>

export const RadioInput = (props: RadioProps) => {
  return (
    <label className={label}>
      <div>
        <input className={radio} type={'radio'} {...props} />
      </div>
      {props.label}
    </label>
  )
}
