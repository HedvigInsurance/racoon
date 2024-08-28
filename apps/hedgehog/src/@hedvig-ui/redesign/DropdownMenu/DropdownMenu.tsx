import { ComponentProps, ReactNode } from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { css } from './DropdownMenu.css'
import { ChevronRight } from 'react-bootstrap-icons'
import clsx from 'clsx'

function DropdownMenuRoot(
  props: ComponentProps<typeof DropdownMenuPrimitive.Root>,
) {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {props.children}
    </DropdownMenuPrimitive.Root>
  )
}

function DropdownMenuTrigger(
  props: ComponentProps<typeof DropdownMenuPrimitive.Trigger>,
) {
  return (
    <DropdownMenuPrimitive.Trigger {...props}>
      {props.children}
    </DropdownMenuPrimitive.Trigger>
  )
}

function DropdownMenuContent(
  props: ComponentProps<typeof DropdownMenuPrimitive.Content>,
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={4}
        className={css.DropdownMenuContent}
        {...props}
        onClick={(e) => {
          e.stopPropagation()
          props.onClick?.(e)
        }}
      >
        {props.children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuItem(
  props: ComponentProps<typeof DropdownMenuPrimitive.Item>,
) {
  return (
    <DropdownMenuPrimitive.Item className={css.DropdownMenuItem} {...props}>
      {props.children}
    </DropdownMenuPrimitive.Item>
  )
}

function SubMenu(props: ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return (
    <DropdownMenuPrimitive.Sub {...props}>
      {props.children}
    </DropdownMenuPrimitive.Sub>
  )
}

function SubMenuTrigger(
  props: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>,
) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      className={clsx(css.DropdownMenuItem, css.DropdownSubMenuTrigger)}
      {...props}
    >
      {props.children}
      <div className={css.rightSlot}>
        <ChevronRight />
      </div>
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function SubMenuContent(
  props: ComponentProps<typeof DropdownMenuPrimitive.SubContent>,
) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        sideOffset={4}
        className={css.DropdownMenuContent}
        {...props}
      >
        {props.children}
      </DropdownMenuPrimitive.SubContent>
    </DropdownMenuPrimitive.Portal>
  )
}

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
}

export const DropdownSubMenu = {
  Root: SubMenu,
  Trigger: SubMenuTrigger,
  Content: SubMenuContent,
}

export function LegacyDropdownMenu(props: {
  children: ReactNode
  target: ReactNode
  position?: ContentPosition
}) {
  const side = getContentSide(props.position ?? 'bottom')

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <span>{props.target}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side={side}>{props.children}</DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

type ContentPosition =
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left'
  | 'topLeft'
const getContentSide = (position: ContentPosition) => {
  switch (position) {
    case 'top':
      return 'top'
    case 'topRight':
      return 'top'
    case 'right':
      return 'right'
    case 'bottomRight':
      return 'bottom'
    case 'bottom':
      return 'bottom'
    case 'bottomLeft':
      return 'bottom'
    case 'left':
      return 'left'
    case 'topLeft':
      return 'top'
  }
}
