import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { type ComponentProps } from 'react'
import { theme } from 'ui'
import { Pillow } from '@/components/Pillow/Pillow'

type Props = {
  pillows: Array<
    Omit<ComponentProps<typeof Pillow>, 'size'> & {
      id: string
    }
  >
}

export const RetargetingPage = (props: Props) => {
  return (
    <Wrapper>
      <Grid>
        {props.pillows.map((item, index) => (
          <PillowWrapper key={item.id} index={index}>
            <Pillow size="small" {...item} priority={true} />
          </PillowWrapper>
        ))}
      </Grid>
    </Wrapper>
  )
}

const Wrapper = styled.div({
  height: ['100dvh', '100vh'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const Grid = styled.div({
  display: 'grid',
  gridAutoFlow: 'column',
  gap: theme.space.xs,
})

const spin = keyframes({
  '0%': { opacity: '0.25' },
  '50%': {
    opacity: '1',
    transform: 'scale(1.05)',
  },
  '100%': { opacity: 0.25 },
})

const PillowWrapper = styled.div<{ index: number }>(({ index }) => {
  const delay = index * 150
  return {
    animation: `${spin} 1000ms both infinite`,
    animationDelay: `${delay}ms`,
  }
})
