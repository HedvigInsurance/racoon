import Image from 'next/image'
import heroImg from '../../assets/hero.jpg'
import styled from '@emotion/styled'

const Wrapper = styled.div({
  width: '100%',
  maxHeight: '600px',
  overflow: 'hidden',
})

export const Hero = () => {
  return (
    <Wrapper>
      <Image
        src={heroImg}
        alt="hero image"
        objectFit="cover"
        layout="responsive"
      />
    </Wrapper>
  )
}
