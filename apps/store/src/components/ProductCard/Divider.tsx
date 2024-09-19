import { tokens } from 'ui'

export const Divider = () => {
  return (
    <div
      style={{
        height: 1,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: tokens.colors.borderOpaque1,
      }}
    />
  )
}
