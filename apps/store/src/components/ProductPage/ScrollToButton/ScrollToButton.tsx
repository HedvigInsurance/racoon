import styled from '@emotion/styled'
import { ChevronIcon } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

export type ScrollToButtonProps = {
  targetRef: React.RefObject<HTMLElement>
  children: string
}

export const ScrollToButton = ({ children, targetRef }: ScrollToButtonProps) => {
  const handleClick = () => targetRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <Wrappper>
      <StyledPillButton onClick={handleClick}>
        <SpaceFlex space={0.5} align="center">
          <TextLabel>{children}</TextLabel>
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
}))

const StyledPillButton = styled.button(({ theme }) => ({
  height: '2rem',
  borderRadius: '1rem',
  backgroundColor: theme.colors.black,
  padding: `0 ${theme.space[4]}`,
  cursor: 'pointer',
}))

const TextLabel = styled.span(({ theme }) => ({
  marginTop: -2,
  color: theme.colors.white,
  lineHeight: 1,
}))

const ChevronUp = styled(ChevronIcon)(({ theme }) => ({
  transform: 'rotate(180deg)',
  color: theme.colors.white,
}))
