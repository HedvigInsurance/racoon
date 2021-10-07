import type { SBHeroBlock } from "@/lib/types";

import HeroSection from "./hero-section";

interface Props {
  block: SBHeroBlock
}

const getSizeFromUrl = (url: string) => {
  const match = url.match(/\d+x\d+/);
  if (match) {
    const [widthString, heightString] = match[0].split('x')
    return {
      width: parseInt(widthString, 10),
      height: parseInt(heightString, 10),
    }
  }

  return {}
};

const HeroBlock: React.FC<Props> = ({ block }) => {
  const imageSrc = block.image.startsWith('//') ? `https:${block.image}` : block.image;

  return (
    <HeroSection src={imageSrc} {...getSizeFromUrl(imageSrc)}>
      <HeroSection.Heading dangerouslySetInnerHTML={{ __html: block.headline }} />
      <HeroSection.Body dangerouslySetInnerHTML={{ __html: block.text.html }} />
      <HeroSection.Link href={block.cta_link.url}>{block.cta_label}</HeroSection.Link>
    </HeroSection>
  )
}

export default HeroBlock;
