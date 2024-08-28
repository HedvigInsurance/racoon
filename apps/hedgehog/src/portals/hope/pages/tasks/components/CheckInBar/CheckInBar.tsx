import { ComponentProps } from 'react'
import { css } from './CheckInBar.css'

export function CheckInBar(props: ComponentProps<'div'>) {
  return <div {...props} className={css.CheckInBar} />
}
