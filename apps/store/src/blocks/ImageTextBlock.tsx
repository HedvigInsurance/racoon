import styled from '@emotion/styled'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import { default as NextImage } from 'next/image'
import { mq } from 'ui'
import { ButtonBlockProps } from '@/blocks/ButtonBlock'
import { HeadingBlockProps } from '@/blocks/HeadingBlock'
import { getSizeFromURL } from '@/blocks/ImageBlock'
import { TextBlockProps } from '@/blocks/TextBlock'
import { SbBaseBlockProps, ExpectedBlockType, StoryblokAsset } from '@/services/storyblok/storyblok'

type ImageTextBlockProps = SbBaseBlockProps<{
  image: StoryblokAsset
  body?: ExpectedBlockType<HeadingBlockProps | TextBlockProps | ButtonBlockProps>
}>

export const ImageTextBlock = ({ blok }: ImageTextBlockProps) => {
  const sizeProps = getSizeFromURL(blok.image.filename)

  return (
    <Wrapper {...storyblokEditable(blok)}>
      <Image src={blok.image.filename} {...sizeProps} alt={blok.image.alt} />
      <BodyWrapper>
        {blok.body?.map((nestedBlock) => (
          <StoryblokComponent key={nestedBlock._uid} blok={nestedBlock} />
        ))}
      </BodyWrapper>
    </Wrapper>
  )
}
ImageTextBlock.blockName = 'imageText'

const Wrapper = styled('div')(({ theme }) => ({
  paddingInline: theme.space[2],
  [mq.lg]: {
    paddingInline: theme.space[4],
  },
}))

const Image = styled(NextImage)(({ theme }) => ({
  borderRadius: theme.radius.md,
  [mq.lg]: {
    borderRadius: theme.radius.xl,
  },
}))

const BodyWrapper = styled.div(({ theme }) => ({
  padding: theme.space[2],
  [mq.lg]: {
    padding: theme.space[4],
  },
  '& > *': {
    paddingInline: 0,
  },
}))
