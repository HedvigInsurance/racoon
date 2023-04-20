import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'

type HeroVideoProps = PropsWithChildren & {
  videoId: string
  height: string
  childrenPadding?: string
}

const HeroVideoWrapper = styled.div(({ height }: Pick<HeroVideoProps, 'height'>) => ({
  position: 'relative',
  height,
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
  height,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
}))

export const HeroVideoVimeo = ({ videoId, height, children, childrenPadding }: HeroVideoProps) => {
  return (
    <HeroVideoWrapper height={height}>
      <StyledIframe
        // NOTE that only certain videos will allow background=1..
        // Maybe only our own videos which we allow to be so? Haven't researched.
        // Read more here: https://vimeo.zendesk.com/hc/en-us/articles/115011183028-Embed-background-and-chromeless-videos
        // This video works: 76979871 (a demo video from Vimeo), but this one doesn't: 22439234 (most viewed, the one I use in the screenshot).
        // When videos don't allow background=1 the controls, logo, title etc will be overlayed anyway.
        src={`https://player.vimeo.com/video/${videoId}?background=1`}
        height={height}
        frameBorder="0"
        allow="autoplay"
      ></StyledIframe>

      <ChildrenWrapper childrenPadding={childrenPadding}>{children}</ChildrenWrapper>
    </HeroVideoWrapper>
  )
}
