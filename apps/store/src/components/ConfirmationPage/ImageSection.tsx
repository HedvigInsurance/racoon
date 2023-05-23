import styled from '@emotion/styled'
import Image from 'next/image'
import { mq } from 'ui'

type Props = {
  image: { src: string; alt: string }
}

export const ImageSection = ({ image }: Props) => {
  return (
    <Wrapper>
      <StyledImage {...image} fill={true} />
    </Wrapper>
  )
}

const Wrapper = styled.section({
  pointerEvents: 'none',

  position: 'relative',
  top: '-20vw',
  height: '100vw',

  [mq.sm]: {
    top: '-10vw',
    height: '71vw',
  },
})

const StyledImage = styled(Image)({
  objectFit: 'cover',
  objectPosition: 'center',
})
