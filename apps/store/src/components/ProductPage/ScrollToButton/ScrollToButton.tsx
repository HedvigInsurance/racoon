import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { Button, mq } from 'ui'

export type ScrollToButtonProps = {
  type: 'button' | 'submit'
  targetRef: React.RefObject<HTMLElement>
  children: ReactNode
}

export const ScrollToButton = ({ children, type, targetRef }: ScrollToButtonProps) => {
  const handleClick = () => targetRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Wrappper>
      <Button type={type} onClick={handleClick} fullWidth>
        {children}
      </Button>
    </Wrappper>
  )
}

const Wrappper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingInline: theme.space[4],
  width: '100%',

  [mq.lg]: { display: 'none' },
}))
