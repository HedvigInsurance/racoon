import styled from '@emotion/styled'
import { ComponentMeta, Story } from '@storybook/react'
import { useRef } from 'react'
import { Button, theme } from 'ui'
import { ScrollPast, ScrollPastProps } from './ScrollPast'

export default {
  title: 'Product Page / Scroll Past',
  component: ScrollPast,
  argTypes: {},
} as ComponentMeta<typeof ScrollPast>

const Template: Story<ScrollPastProps> = (props) => {
  const ref = useRef(null)

  return (
    <div>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>Before target</p>
      <p>.</p>

      <p ref={ref}>I am the scroll target!</p>

      <ScrollPast {...props} targetRef={ref}>
        <FixedFooter>
          <Button>Scroll back up</Button>
        </FixedFooter>
      </ScrollPast>

      <p>.</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
      <p>After target</p>
    </div>
  )
}

const FixedFooter = styled.div({
  position: 'fixed',
  bottom: 0,
  right: 0,
  left: 0,
  padding: theme.space[4],
  display: 'flex',
  justifyContent: 'center',
})

export const Default = Template.bind({})
Default.args = {}
