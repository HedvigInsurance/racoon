import clsx from 'clsx'
import { yStack, xStack } from 'ui'
import { stickyProductHeader, stickyProductHeaderContent } from './StickyProductHeader.css'

type Props = {
  children: React.ReactNode
  hasScrolledPast: boolean
}

export function StickyProductHeader({ children, hasScrolledPast }: Props) {
  return (
    <div className={stickyProductHeader}>
      <div
        className={clsx(
          yStack({
            gap: 'md',
            paddingBlock: 'sm',
            paddingInline: 'md',
          }),
          stickyProductHeaderContent.base,
          hasScrolledPast && stickyProductHeaderContent.visible,
        )}
      >
        <div
          className={clsx(
            xStack({
              gap: 'sm',
              alignItems: 'center',
            }),
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
