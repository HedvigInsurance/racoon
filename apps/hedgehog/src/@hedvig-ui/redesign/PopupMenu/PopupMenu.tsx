import { ComponentProps, ReactNode } from 'react'
import { menuLabel } from './PopupMenu.css'
import { DropdownMenu, LegacyDropdownMenu } from '../DropdownMenu/DropdownMenu'

type PopupContentProps = {
  visible: boolean
  onClose: (e: MouseEvent | TouchEvent) => void
  position?:
    | 'top'
    | 'topRight'
    | 'right'
    | 'bottomRight'
    | 'bottom'
    | 'bottomLeft'
    | 'left'
    | 'topLeft'
  children: ReactNode
}

type PopupMenuProps = {
  target: ReactNode
} & PopupContentProps

export const PopupMenu = (props: PopupMenuProps) => {
  const { target } = props
  return (
    <LegacyDropdownMenu target={target} position={props.position}>
      {props.children}
    </LegacyDropdownMenu>
  )
}

export const PopupMenuLabel = (props: ComponentProps<'div'>) => {
  return <div {...props} className={menuLabel} />
}

export const PopupMenuItem = (
  props: ComponentProps<typeof DropdownMenu.Item>,
) => {
  return <DropdownMenu.Item {...props} />
}
