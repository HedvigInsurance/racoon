import { mq } from 'ui'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  width: '100%',
  maxHeight: '600px',
  overflow: 'hidden',

  [mq.lg]: {
    position: 'fixed',
    maxHeight: 'none',
    width: '50vw',
    height: '100vh',
  },
})

const Img = styled.img({
  width: '100%',
  [mq.lg]: {
    height: '100%',
    width: '50vw',
    objectFit: 'cover',
  },
})

type HeroProps = {
  mobileImgSrc: string
  desktopImgSrc: string
}

export const Hero = ({ mobileImgSrc, desktopImgSrc }: HeroProps) => {
  return (
    <Wrapper>
      <picture>
        <source media="(orientation: portrait)" srcSet={mobileImgSrc} />
        <source media="(orientation: landscape)" srcSet={desktopImgSrc} />
        <Img src={mobileImgSrc} />
      </picture>
    </Wrapper>
  )
}
