import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { TopPickCard } from '@/components/TopPickCard/TopPickCard'
import { SbBaseBlockProps, LinkField, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getImgSrc, getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type TopPickCardBlockProps = SbBaseBlockProps<{
  title: string
  subtitle: string
  image: StoryblokAsset
  link: LinkField
}>

export const TopPickCardBlock = ({ blok }: TopPickCardBlockProps) => {
  return (
    <StyledLink href={getLinkFieldURL(blok.link, blok.title)} {...storyblokEditable(blok)}>
      <TopPickCard
        title={blok.title}
        subtitle={blok.subtitle}
        image={{ src: getImgSrc(blok.image.filename), alt: blok.image.alt }}
      />
    </StyledLink>
  )
}
TopPickCardBlock.blockName = 'topPickCard'

const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
})
