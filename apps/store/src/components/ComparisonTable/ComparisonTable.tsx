import { clsx } from 'clsx'
import { type ComponentPropsWithoutRef } from 'react'
import {
  Text,
  CheckIcon as PerilsCheckIcon,
  MinusIcon,
  ChevronIcon,
  theme,
  type CheckIconProps as PerilsCheckIconProps,
  type MinusIconProps,
  sprinkles,
} from 'ui'
import Collapsible from '@/components/Collapsible/Collapsible'
import { ColorIcon } from '../Perils/Perils'
import {
  table,
  row,
  header,
  activeHeader,
  cell,
  activeCell,
  aligner,
  collapsibleTrigger,
  collapsibleContent,
  triggerIcon,
} from './ComparisonTable.css'

export function Root({ className, ...props }: ComponentPropsWithoutRef<'table'>) {
  return <table className={clsx(table, className)} {...props} />
}

export function Head(props: ComponentPropsWithoutRef<'thead'>) {
  return <thead {...props} />
}

export function Body(props: ComponentPropsWithoutRef<'tbody'>) {
  return <tbody {...props} />
}

export function Row({ className, ...props }: ComponentPropsWithoutRef<'tr'>) {
  return <tr className={clsx(row, className)} {...props} />
}

type HeaderProps = ComponentPropsWithoutRef<'th'> & { active?: boolean }

export function Header({ children, active, ...props }: HeaderProps) {
  return (
    <th className={clsx(header, active && activeHeader)} {...props}>
      {children && (
        <Text as="span" size="xs" color="textSecondary" align="center">
          {children}
        </Text>
      )}
    </th>
  )
}

type TitleDataCellProps = Omit<ComponentPropsWithoutRef<'td'>, 'children'> & {
  title: string
  description?: string
  perilColor?: string | null
}

export function TitleDataCell({
  className,
  title,
  description,
  perilColor,
  ...props
}: TitleDataCellProps) {
  const Title = (
    <>
      {perilColor && <ColorIcon color={perilColor} />}
      <Text className={title} as="span" size={{ _: 'xs', lg: 'md' }} color="textPrimary">
        {title}
      </Text>
    </>
  )
  const Children = description ? (
    <Collapsible.Root>
      <Collapsible.Trigger className={collapsibleTrigger}>
        {Title}
        <ChevronIcon className={triggerIcon} />
      </Collapsible.Trigger>

      <Collapsible.Content
        className={clsx(collapsibleContent, perilColor && sprinkles({ pl: 'xl' }))}
      >
        <Text as="span" size="xs" color="textSecondary">
          {description}
        </Text>
      </Collapsible.Content>
    </Collapsible.Root>
  ) : (
    Title
  )

  return (
    <td className={clsx(cell, className)} {...props}>
      {Children}
    </td>
  )
}

type DataCellProps = ComponentPropsWithoutRef<'td'> & {
  alignment?: 'left' | 'center' | 'right'
  active?: boolean
}

export function DataCell({
  className,
  children,
  active,
  alignment = 'center',
  ...props
}: DataCellProps) {
  return (
    <td className={clsx(cell, active && activeCell, className)} {...props}>
      <span className={aligner[alignment]}>{children}</span>
    </td>
  )
}

export function CheckIcon(props: PerilsCheckIconProps) {
  return <PerilsCheckIcon size="1rem" {...props} />
}

export function MissingIcon(props: MinusIconProps) {
  return <MinusIcon size="1.25rem" color={theme.colors.gray500} {...props} />
}
