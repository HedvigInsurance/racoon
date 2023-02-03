import styled from '@emotion/styled'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { mq } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'

type Props = {
  image: { src: string; alt: string }
  children: ReactNode
}

export const FooterSection = ({ image, children }: Props) => {
  return (
    <Wrapper>
      <FooterImage {...image} fill />
      <GridLayout.Root>
        <GridLayout.Content>{children}</GridLayout.Content>
      </GridLayout.Root>
    </Wrapper>
  )
}

const Wrapper = styled.section({
  position: 'relative',

  minHeight: '30rem',

  [mq.sm]: {
    minHeight: '40rem',
  },

  [mq.lg]: {
    minHeight: '50rem',
  },
})

const FooterImage = styled(Image)({
  objectFit: 'contain',
  objectPosition: 'right bottom',

  maxWidth: '1920px',
  marginInline: 'auto',

  [mq.lg]: {
    objectPosition: 'right top',
  },
})
