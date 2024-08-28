import * as React from 'react'

import { SearchableDropdown } from './SearchableDropdown'
import { NonSearchableDropdown } from './NonSearchableDropdown'
import { WrapperSelect } from '../Select/Select.types'

export interface DropdownProps extends WrapperSelect<false> {
  searchable?: boolean
}

export const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (props, ref) => {
    const { searchable, ...rest } = props

    const Component = searchable ? SearchableDropdown : NonSearchableDropdown

    return <Component {...rest} ref={ref} />
  },
)
