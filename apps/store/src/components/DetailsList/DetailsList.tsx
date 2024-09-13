import clsx from 'clsx'
import { type ComponentProps } from 'react'
import { type FontSizeProps, sprinkles } from 'ui'
import {
  detailsListItem,
  detailsListLabel,
  detailsListRoot,
  detailsListValue,
} from './DetailsList.css'

type RootProps = ComponentProps<'ul'> & {
  size?: FontSizeProps
}
const DetailsListRoot = ({ size = 'xs', className, children, ...props }: RootProps) => {
  return (
    <ul className={clsx(detailsListRoot, sprinkles({ fontSize: size }), className)} {...props}>
      {children}
    </ul>
  )
}

type ItemProps = ComponentProps<'li'>
const DetailsListItem = ({ className, children, ...props }: ItemProps) => {
  return (
    <li className={clsx(className, detailsListItem)} {...props}>
      {children}
    </li>
  )
}

type LabelProps = ComponentProps<'span'>
const DetailsListLabel = ({ className, children, ...props }: LabelProps) => {
  return (
    <span className={clsx(className, detailsListLabel)} {...props}>
      {children}
    </span>
  )
}

type ValueProps = ComponentProps<'span'>
const DetailsListValue = ({ className, children, ...props }: ValueProps) => {
  return (
    <span className={clsx(className, detailsListValue)} {...props}>
      {children}
    </span>
  )
}

export const DetailsList = {
  Root: DetailsListRoot,
  Item: DetailsListItem,
  Label: DetailsListLabel,
  Value: DetailsListValue,
}
