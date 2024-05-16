import { clsx } from 'clsx'
import { type ComponentPropsWithoutRef } from 'react'
import {
  Text,
  CheckIcon as PerilsCheckIcon,
  type CheckIconProps as PerilsCheckIconProps,
  MinusIcon,
  type MinusIconProps,
  theme,
} from 'ui'
import { table, row, header, activeHeader, cell, activeCell, aligner } from './ComparisonTable.css'

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

export function TitleDataCell({ className, children, ...props }: ComponentPropsWithoutRef<'td'>) {
  return (
    <td className={clsx(cell, className)} {...props}>
      <Text as="span" size={{ _: 'sm', lg: 'md' }}>
        {children}
      </Text>
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
