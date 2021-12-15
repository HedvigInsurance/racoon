import type { FC, ComponentPropsWithoutRef } from 'react'
import type { ImageProps } from 'next/image'

import Image from 'next/image'

/**
 * Example:
 * 
 * <HeroSection src="https://via.placeholder.com/1200x800">
 *  <HeroSection.Heading>Hedvig rules the Nordics</HeroSection.Heading>
 *  <HeroSection.BodyText>PRESS - 19 Maj. 2021</HeroSection.BodyText>
 *  <HeroSection.Link href="https://www.hedvig.com/press/">Read more</HeroSection.Link>
 * </HeroSection>
*/

type HeroSectionComposition = FC<ImageProps> & {
  Heading: typeof Heading
  Body: typeof BodyText
  Link: typeof LinkButton
}

const HeroSection: HeroSectionComposition = ({children, ...props}) => (
  <div>
    <Image {...props} />
    {children}
  </div>
)

const Heading: FC<ComponentPropsWithoutRef<'h1'>> = (props) => (
  <h1 {...props} />
)

const BodyText: FC<ComponentPropsWithoutRef<'p'>> = (props) => (
  <div {...props} />
)

const LinkButton: React.FC<React.ComponentPropsWithoutRef<'a'>> = (props) => (
  <a {...props} />
)

HeroSection.Heading = Heading
HeroSection.Body = BodyText
HeroSection.Link = LinkButton

export default HeroSection
