import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

type HeroVideoProps = PropsWithChildren & {
  videoId: string
  height: string
  childrenPadding?: string
}

const HeroVideoWrapper = styled.div(({ height }: Pick<HeroVideoProps, 'height'>) => ({
  position: 'relative',
  height: height,
}))

const ChildrenWrapper = styled.div(
  ({ childrenPadding }: Pick<HeroVideoProps, 'childrenPadding'>) => ({
    position: 'absolute',
    top: childrenPadding ?? '50%',
    width: '100%',
  }),
)

// We need to force the iframe to be larger than the viewport to mimic `object-fit: cover`
const getWidth = (height: string) => Number(height.replace('vh', '')) * 1.8

const StyledIframe = styled.iframe(({ height }: Pick<HeroVideoProps, 'height'>) => ({
  width: `${getWidth(height)}vw`,
  height: height ?? '80vh',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}))

export const HeroVideoVimeo = ({ videoId, height, children, childrenPadding }: HeroVideoProps) => {
  return (
    <HeroVideoWrapper height={height}>
      <StyledIframe
        src={`https://player.vimeo.com/video/${videoId}?background=1`}
        height={height}
        frameBorder="0"
        allow="autoplay"
      ></StyledIframe>

      <ChildrenWrapper childrenPadding={childrenPadding}>{children}</ChildrenWrapper>
    </HeroVideoWrapper>
  )
}
