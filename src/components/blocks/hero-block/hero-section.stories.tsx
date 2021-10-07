import type { ComponentStory, ComponentMeta } from '@storybook/react'
import type { FC } from 'react'

import HeroSection from "./hero-section"

interface Props {
  title: string;
  backgroundImage: string;
  body: string;
  link: string;
  linkText: string;
}

const HeroSectionComponent: FC<Props> = ({ title, backgroundImage, body, link, linkText }) => (
  <HeroSection src={backgroundImage}>
    <HeroSection.Heading>{title}</HeroSection.Heading>
    <HeroSection.Body>{body}</HeroSection.Body>
    <HeroSection.Link href={link}>{linkText}</HeroSection.Link>
  </HeroSection>
)

export default {
  title: 'Blocks/Hero Block',
  component: HeroSectionComponent,
} as ComponentMeta<typeof HeroSectionComponent>

const Template: ComponentStory<typeof HeroSectionComponent> = (args) => <HeroSectionComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Hedvig rules the Nordics',
  backgroundImage: 'https://via.placeholder.com/1200x800',
  body: 'PRESS - 19 maj 2021',
  link: '#',
  linkText: 'Read more',
};
