import { type PropsWithChildren } from 'react'
import { CheckIcon } from 'ui/src/icons/CheckIcon'
import { Text } from 'ui'
import { productUsp, checkicon } from './ProductUsp.css'

export function ProductUsp({ children }: PropsWithChildren) {
  return (
    <div className={productUsp}>
      <Text color="textTranslucentSecondary">{children}</Text>
      <CheckIcon className={checkicon} size="1rem" role="presentation" />
    </div>
  )
}
