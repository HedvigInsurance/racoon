import styled from '@emotion/styled'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
import { TopPickCard } from '@/components/TopPickCard/TopPickCard'
import { SbBaseBlockProps, LinkField, StoryblokAsset } from '@/services/storyblok/storyblok'
import { getLinkFieldURL } from '@/services/storyblok/Storyblok.helpers'

export type TopPickCardBlockProps = SbBaseBlockProps<{
  title: string
  subtitle: string
  image: StoryblokAsset
  link: LinkField
}>

export const TopPickCardBlock = ({ blok }: TopPickCardBlockProps) => {
  return (
    <Link href={getLinkFieldURL(blok.link)} passHref {...storyblokEditable(blok)} legacyBehavior>
      <StyledAnchor>
        <TopPickCard
          title={blok.title}
          subtitle={blok.subtitle}
          image={{ src: blok.image.filename, alt: blok.image.alt }}
        />
      </StyledAnchor>
    </Link>
  )
}
TopPickCardBlock.blockName = 'topPickCard'

const StyledAnchor = styled.a({
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
})
