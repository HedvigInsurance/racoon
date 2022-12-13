import styled from '@emotion/styled'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import * as AllIcons from './index'

const AllIconNames = Object.keys(AllIcons)

type IconProps = {
  icon: string
}
const Icon = ({ icon }: IconProps) => {
  const Component = AllIcons[icon as keyof typeof AllIcons]
  return <Component />
}

const IconWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  paddingBottom: '1rem',
})

const Template: ComponentStory<typeof Icon> = () => {
  return (
    <>
      {AllIconNames.map((icon) => (
        <IconWrapper>
          <div>{icon}</div>
          <Icon icon={icon} />
        </IconWrapper>
      ))}
    </>
  )
}

export const Default = Template.bind({})

export default {
  title: 'Icons',
  component: Icon,
} as ComponentMeta<typeof Icon>
