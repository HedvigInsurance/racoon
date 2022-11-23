import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { ChevronIcon } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export type ScrollToButtonProps = {
  type: 'button' | 'submit'
  targetRef: React.RefObject<HTMLElement>
  children: ReactNode
}

export const ScrollToButton = ({ children, type, targetRef }: ScrollToButtonProps) => {
  const handleClick = () => targetRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Wrappper>
      <StyledPillButton type={type} onClick={handleClick}>
        <SpaceFlex space={0.5} align="center">
          {children}
          <ChevronUp size="0.75rem" />
        </SpaceFlex>
      </StyledPillButton>
    </Wrappper>
  )
}

const Wrappper = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: theme.space[5],
  width: '100%',
}))

const StyledPillButton = styled.button(({ theme }) => ({
  color: theme.colors.white,
  height: '2rem',
  borderRadius: '1rem',
  backgroundColor: theme.colors.black,
  padding: `0 ${theme.space[4]}`,
  cursor: 'pointer',
}))

const ChevronUp = styled(ChevronIcon)(({ theme }) => ({
  transform: 'rotate(180deg)',
  color: theme.colors.white,
}))
