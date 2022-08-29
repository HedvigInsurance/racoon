import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Image from 'next/image'
import { HeadingBlock, HeadingBlockProps } from '@/blocks/HeadingBlock'
import { SbBaseBlockProps, StoryblokImage } from '@/services/storyblok/storyblok'

type ImageBlockProps = SbBaseBlockProps<{
  image: StoryblokImage
  fullBleed?: boolean
  body?: Array<HeadingBlockProps['blok']>
}>

export const ImageBlock = ({ blok }: ImageBlockProps) => {
  const sizeProps = getSizeFromURL(blok.image.filename)

  return (
    <Wrapper {...storyblokEditable(blok)} margins={blok.fullBleed ? false : true}>
      <Image src={blok.image.filename} {...sizeProps} alt={blok.image.alt} />
      <BodyWrapper>
        {blok.body?.map((nestedBlock) => (
          <HeadingBlock key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </BodyWrapper>
    </Wrapper>
  )
}
ImageBlock.blockName = 'image'

const Wrapper = styled.div<{ margins: boolean }>(({ theme, margins = true }) => ({
  paddingLeft: margins ? theme.space[4] : 0,
  paddingRight: margins ? theme.space[4] : 0,
  position: 'relative',
}))

const BodyWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  top: theme.space[4],
  left: theme.space[4],
  right: theme.space[4],
}))

const getSizeFromURL = (url: string) => {
  const [, rawWidth, rawHeight] = url.match(/\/(\d+)x(\d+)\//) || []

  const width = parseInt(rawWidth, 10) || 0
  const height = parseInt(rawHeight, 10) || 0

  return { width, height }
}
