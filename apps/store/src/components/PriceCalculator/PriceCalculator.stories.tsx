import { ComponentMeta, Story } from '@storybook/react'
import { PriceCalculator, PriceCalculatorProps } from './PriceCalculator'

export default {
  title: 'Price Calculator',
  component: PriceCalculator,
  argTypes: {
    onSubmit: { action: 'onSubmit' },
  },
} as ComponentMeta<typeof PriceCalculator>

const Template: Story<PriceCalculatorProps> = (props: PriceCalculatorProps) => {
  return <PriceCalculator {...props} />
}

export const Default = Template.bind({})
Default.args = {
  template: {
    sections: [
      {
        id: 'your-home',
        title: {
          key: 'Your home',
        },
        fields: [
          {
            name: 'street',
            columnSpan: 6,
            type: 'text',
            label: {
              key: 'Street',
            },
            required: true,
            defaultValue: '',
          },
          {
            name: 'livingSpace',
            columnSpan: 3,
            type: 'number',
            label: {
              key: 'Living Space',
            },
            required: true,
            defaultValue: '',
          },
          {
            name: 'zipCode',
            columnSpan: 3,
            type: 'text',
            label: {
              key: 'Zip Code',
            },
            required: true,
            defaultValue: '',
          },
          {
            name: 'subType',
            columnSpan: 6,
            type: 'radio',
            label: {
              key: 'Type of apartment',
            },
            required: true,
            options: [
              {
                label: {
                  key: 'I rent',
                },
                value: 'RENT',
              },
              {
                label: {
                  key: 'I own',
                },
                value: 'OWN',
              },
            ],
            defaultValue: '',
          },
        ],
        submit: {
          key: 'Next step',
        },
        state: 'INITIAL',
      },
      {
        id: 'insured-people',
        title: {
          key: 'Insured people',
        },
        fields: [
          {
            name: 'birthDate',
            columnSpan: 3,
            type: 'date',
            label: {
              key: 'Birth Date',
            },
            required: false,
            defaultValue: '',
          },
          {
            name: 'numberCoInsured',
            columnSpan: 3,
            type: 'number',
            label: {
              key: 'Number Co-Insured',
            },
            required: true,
            defaultValue: 1,
          },
        ],
        submit: {
          key: 'Calculate price',
        },
        state: 'INITIAL',
      },
    ],
  },
}
