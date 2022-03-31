import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { BurgerButton, BurgerButtonProps } from './BurgerButton'

export default {
  title: 'UI / Button / BurgerButton',
  component: BurgerButton,
} as ComponentMeta<typeof BurgerButton>

const Template: ComponentStory<typeof BurgerButton> = (props: BurgerButtonProps) => {
  return <BurgerButton {...props} />
}

export const Default = Template.bind({})
Default.args = {
  onClick: () => {
    console.log('click')
  },
}
