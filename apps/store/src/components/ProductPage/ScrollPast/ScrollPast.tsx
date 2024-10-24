import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from 'ui/src/theme/theme'
import { zIndexes } from '@/utils/zIndex'
import { useHasScrolledPast } from './useHasScrolledPast'

export type ScrollPastProps = {
  targetRef: React.RefObject<HTMLElement>
  children: React.ReactNode
  className?: string
}

export const ScrollPast = ({ targetRef, children, className }: ScrollPastProps) => {
  const hasScrolledPast = useHasScrolledPast({ targetRef })

  return (
    <StyledWrapper
      className={className}
      variants={{
        hidden: { opacity: 0, transitionEnd: { display: 'none' } },
        visible: { opacity: 1, display: 'block' },
      }}
      initial="hidden"
      animate={hasScrolledPast ? 'visible' : 'hidden'}
    >
      {children}
    </StyledWrapper>
  )
}

const StyledWrapper = styled(motion.div)({
  position: 'fixed',
  bottom: theme.space.md,
  left: 0,
  right: 0,
  zIndex: zIndexes.scrollPast,
})
