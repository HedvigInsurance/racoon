import { type Meta, type StoryObj } from '@storybook/react'
import { ArticleTeaser } from './ArticleTeaser'

const meta: Meta = {
  title: 'Blog / Article Teaser',
  parameters: { grid: { width: '1/3' } },
}

export default meta
type Story = StoryObj

export const Primary: Story = {
  render: () => (
    <ArticleTeaser.Root
      href="/se"
      title="Hedvig och Mimmi Blomqvist lanserar hundskålar i limiterad upplaga"
      ingress="I ett nytt samarbete har Hedvig tillsammans med designern Mimmi Blomqvist ställt sig frågan
        vad som händer när en hundskål inte bara fyller en funktion, utan också blir ett
        designobjekt. Resultatet är en limiterad upplaga handgjorda hundskålar i porslin med Mimmi
        Blomqvists karaktäristiska formspråk."
      date="2021.05.12"
    >
      <ArticleTeaser.Image
        src="https://assets.hedvig.com/f/165473/1000x700/641eb5d891/mimmi-blomqvist-hedvig-blogg.jpg"
        width={800}
        height={450}
        alt="Mimmi"
      />
    </ArticleTeaser.Root>
  ),
}
