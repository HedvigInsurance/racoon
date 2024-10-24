import styled from '@emotion/styled'
import { type ReactNode } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { mq, theme } from 'ui'

type ScrollToTopButtonProps = {
  type: 'button' | 'submit'
  children: ReactNode
}

export const ScrollToTopButton = ({ children, type }: ScrollToTopButtonProps) => {
  const handleClick = () => window.scrollTo({ top: 0 })

  return (
    <Wrapper>
      <Button type={type} onClick={handleClick} fullWidth={true}>
        {children}
      </Button>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  paddingInline: theme.space.md,
  width: '100%',

  [mq.lg]: { display: 'none' },
})
