import { ReactNode } from 'react'
import { CopyIcon } from '@hedvig-ui/icons'
import { LegacyTooltip } from '@hedvig-ui/redesign'
import copy from 'copy-to-clipboard'
import toast from 'react-hot-toast'

export const ClickToCopy = (props: { value: string; children?: ReactNode }) => {
  const { value, children = <CopyIcon /> } = props
  return (
    <LegacyTooltip content="Copy">
      <div
        onClick={() => {
          copy(value)
          toast.success('Copied to clipboard')
        }}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </div>
    </LegacyTooltip>
  )
}
