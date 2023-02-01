import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { Button, mq, theme } from 'ui'

export type ScrollToButtonProps = {
  type: 'button' | 'submit'
  targetRef: React.RefObject<HTMLElement>
  children: ReactNode
}

export const ScrollToButton = ({ children, type, targetRef }: ScrollToButtonProps) => {
  const handleClick = () => targetRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Wrapper>
      <Button type={type} onClick={handleClick}>
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
