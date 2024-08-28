import { ComponentProps } from 'react'
import { css } from './TopBar.css'
import clsx from 'clsx'
import { Icon, XCircleFill } from 'react-bootstrap-icons'

export function TopBar(props: ComponentProps<'div'>) {
  return <div {...props} className={css.TopBar} />
}

function TopBarItem(props: ComponentProps<'div'> & { selected?: boolean }) {
  return (
    <div
      {...props}
      className={clsx(
        css.TopBarItem.base,
        props.selected ? css.TopBarItem.selected : css.TopBarItem.default,
      )}
    />
  )
}

function CloseTrigger(props: ComponentProps<Icon>) {
  return <XCircleFill {...props} className={css.CloseTrigger} />
}

TopBarItem.CloseTrigger = CloseTrigger

TopBar.Item = TopBarItem
