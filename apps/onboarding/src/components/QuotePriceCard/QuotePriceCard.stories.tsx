import { Meta, StoryFn } from '@storybook/react'
import { useState } from 'react'
import { Space } from 'ui'
import { SelectableCardGroup } from '../Card/SelectableCardGroup'
import { QuotePriceCard } from './QuotePriceCard'

export default {
  title: 'Card / Quote Price Card',
  component: QuotePriceCard,
  args: {},
} as Meta<typeof QuotePriceCard>

const Template: StoryFn<typeof QuotePriceCard> = (args) => {
  return <QuotePriceCard {...args}></QuotePriceCard>
}

export const Default = Template.bind({})
Default.args = {
  size: 'md',
  price: '798 SEK/month',
  title: (
    <>
      Home insurance &<br /> Accident insurance
    </>
  ),
}

const SelectableTemplate: StoryFn<typeof QuotePriceCard> = (args) => {
  const [firstIsSelected, setFirstIsSelected] = useState(false)
  const [secondIsSelected, setSecondIsSelected] = useState(false)

  return (
    <Space y={1}>
      <QuotePriceCard
        {...args}
        checked={firstIsSelected}
        onChange={setFirstIsSelected}
        selectable
        name="first"
        price="598 SEK/month"
        title={<>Home insurance</>}
      ></QuotePriceCard>
      <QuotePriceCard
        {...args}
        checked={secondIsSelected}
        onChange={setSecondIsSelected}
        selectable
        name="second"
        price="798 SEK/month"
        title={
          <>
            Home insurance &<br /> Accident insurance
          </>
        }
      ></QuotePriceCard>
    </Space>
  )
}

export const AsCheckbox = SelectableTemplate.bind({})
AsCheckbox.args = {
  selectable: true,
  size: 'md',
}

const RadioTemplate: StoryFn<typeof QuotePriceCard> = (args) => {
  return (
    <SelectableCardGroup name="some_name" onChange={() => {}}>
      <Space y={1}>
        <QuotePriceCard
          {...args}
          size="md"
          selectable
          id="first"
          price="598 SEK/month"
          title={<>Home insurance</>}
        ></QuotePriceCard>
        <QuotePriceCard
          {...args}
          size="md"
          selectable
          id="second"
          price="798 SEK/month"
          title={
            <>
              Home insurance &<br /> Accident insurance
            </>
          }
        ></QuotePriceCard>
      </Space>
    </SelectableCardGroup>
  )
}

export const AsRadioButtons = RadioTemplate.bind({})
AsRadioButtons.args = {}
