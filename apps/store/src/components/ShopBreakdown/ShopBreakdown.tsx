import { type PropsWithChildren } from 'react'
import { Space, theme } from 'ui'

export const ShopBreakdown = (props: PropsWithChildren) => {
  return <Space y={1}>{props.children}</Space>
}

export const Divider = () => {
  return (
    <div
      style={{
        height: 1,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.borderOpaque1,
      }}
    />
  )
}
