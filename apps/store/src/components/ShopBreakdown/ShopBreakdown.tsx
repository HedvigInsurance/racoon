import { type PropsWithChildren } from 'react'
import { Space } from 'ui'

export const ShopBreakdown = (props: PropsWithChildren) => {
  return <Space y={1}>{props.children}</Space>
}
