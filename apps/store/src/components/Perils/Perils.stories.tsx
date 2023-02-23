import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Button, theme } from 'ui'
import { PerilFragment } from '@/services/apollo/generated'
import { Perils } from './Perils'

// Helpers

type RANDOM_NUMBER_SIZE_TYPE = (typeof RANDOM_NUMBER_SIZE)[keyof typeof RANDOM_NUMBER_SIZE]
const RANDOM_NUMBER_SIZE = {
  SMALL: 5,
  MEDIUM: 50,
  LARGE: 100,
  XLARGE: 400,
} as const

const randomNumber = (num: number) => Math.floor(Math.random() * num)
const getPerilCoveredArray = () => {
  const randomLength = Math.floor(Math.random() * RANDOM_NUMBER_SIZE.SMALL)
  return Array.from({ length: randomLength }, () => getIpsumSlice(RANDOM_NUMBER_SIZE.LARGE))
}

const getPerilTitle = () => {
  const randomIndex = Math.floor(Math.random() * perilTitles.length)
  return perilTitles[randomIndex]
}

const getIpsumSlice = (length: RANDOM_NUMBER_SIZE_TYPE) =>
  LOREM_IPSUM.slice(0, randomNumber(length))

const createNewPeril = (): PerilFragment => ({
  title: getPerilTitle(),
  description: getIpsumSlice(RANDOM_NUMBER_SIZE.XLARGE),
  covered: getPerilCoveredArray(),
  exceptions: [getIpsumSlice(RANDOM_NUMBER_SIZE.LARGE)],
})

// Story

export default {
  title: 'Accordion/Perils',
  component: Perils,
} as ComponentMeta<typeof Perils>

export const FivePerils: ComponentStory<typeof Perils> = () => {
  const perils = Array.from({ length: 5 }, () => createNewPeril())
  return <Perils items={perils} />
}

export const Playground: ComponentStory<typeof Perils> = () => {
  const [perils, setPerils] = useState<Array<PerilFragment>>(() => {
    return Array.from({ length: 3 }, () => createNewPeril())
  })

  const addPeril = (): void => {
    setPerils((perils) => [...perils, createNewPeril()])
  }
  const removePeril = () => {
    setPerils((perils) => perils.slice(0, perils.length - 1))
  }

  return (
    <PageWrapper>
      <PerilsWrapper>
        <Perils items={perils} />
      </PerilsWrapper>
      <ButtonWrapper>
        <Button onClick={addPeril}>Add Peril</Button>
        <Button onClick={removePeril}>Remove Peril</Button>
      </ButtonWrapper>
    </PageWrapper>
  )
}

const PageWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '95dvh',
})

const PerilsWrapper = styled.div({
  height: '100%',
})
const ButtonWrapper = styled.div({
  display: 'flex',
  gap: theme.space.md,
  paddingBottom: theme.space.xl,
})

const LOREM_IPSUM =
  `Laboris culpa consequat sint. Voluptate enim ad quis duis est. Anim ex do in labore duis cupidatat anim sit aute. Reprehenderit labore aliqua sint in tempor minim voluptate id amet commodo qui dolor. Officia magna minim esse. Voluptate duis consectetur ad ex est. 
  Est velit fugiat incididunt reprehenderit in ad velit minim eiusmod. Anim exercitation dolor ipsum esse anim ad dolor ea. Dolor sunt minim ea labore labore qui. Consectetur do irure aute esse.
  Magna laboris nostrud qui ipsum velit sint consequat culpa et. Mollit nulla deserunt officia tempor nisi voluptate ex. Veniam proident ad ea consequat. In cillum officia dolor reprehenderit. Pariatur ut minim culpa. Occaecat minim dolore Lorem deserunt adipisicing 
  in est officia sunt sit labore do. Consequat aliquip quis veniam ea voluptate laboris. Est aliqua veniam magna. Officia fugiat in velit.` as const

const perilTitles = [
  'Fire',
  'Eldsvåda',
  'Water leaks',
  'Vattenläcka',
  'Storms',
  'Oväder',
  'Burglary',
  'Inbrott',
  'Theft and damage',
  'Stöld och skadegörelse',
  'Liability protection',
  'Ansvarsskydd',
  'Legal protection',
  'Rättskydd',
  'Travel insurance',
  'Resetrubbel',
  'Assault',
  'Överfall',
  'Travel illness',
  'Sjuk på resa',
  'White goods',
  'Vitvaror',
  'All-risk',
  'Drulle',
  'Criminal damage',
  'Skadegörelse',
  'Tenant ownership',
  'Bostadsrättstillägg',
  'Care and treatment',
  'Vård & Behandling',
  'Dental injury',
  'Tandskada',
  'Hospitalisation',
  'Sjukhusvistelse',
  'Scarring',
  'Ärr',
  'Crisis cover',
  'Krishjälp',
  'Permanent injury',
  'Bestående men',
  'Lost or reduced working capacity',
  'Förlorad arbetsförmåga',
  'Death',
  'Dödsfall',
  'Pests',
  'Skadedjur',
  'Rebuilding',
  'Ombyggnation',
  'Traffic insurance, personal injury',
  'Trafikförsäkring, personskador',
  'Traffic insurance, third-party property',
  'Trafikförsäkring, annans egendom',
  'Theft & burglary',
  'Stöld & inbrott',
  'Brand',
  'Glass damage',
  'Glas',
  'Roadside assistance',
  'Räddningshjälp och bärgning',
  'Motor insurance',
  'Maskinskydd',
  'Liability coverage',
  'Rättsskydd',
  'Crisis counseling',
  'Kristerapi',
  'Car body damage',
  'Vagnskada',
] as const
