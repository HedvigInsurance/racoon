import styled from '@emotion/styled'
import type { Meta, StoryFn } from '@storybook/react'
import { useRef } from 'react'
import { Button } from 'ui/src/components/Button/Button'
import { theme } from 'ui/src/theme/theme'
import type { ScrollPastProps } from './ScrollPast'
import { ScrollPast } from './ScrollPast'

const meta: Meta<typeof ScrollPast> = {
  title: 'Product Page / Scroll Past',
  component: ScrollPast,
  argTypes: {},
} as Meta<typeof ScrollPast>

export default meta

const Template: StoryFn<ScrollPastProps> = (props) => {
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
  padding: theme.space.md,
  display: 'flex',
  justifyContent: 'center',
})

export const Default = {
  render: Template,
  args: {},
}
