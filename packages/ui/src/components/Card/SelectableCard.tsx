import { Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import * as Checkbox from '@radix-ui/react-checkbox'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { mq } from '../../lib/media-query'
import { CardContent, CardProps, cardStyle } from './Card'

export type SelectableCardProps = CardProps & {
  checked?: boolean
  as?: 'radio' | 'checkbox'

  // Checkbox options

  // When rendered as a checkbox, you need to pass `name` to identify this component in a form
  name?: string
  onChange?: (checked: boolean) => void

  // Radio options

  // When rendered as a radio, you need to pass `id` to identify this component in a radio group
  id?: string
}

const selectableCardStyles = (props: SelectableCardProps & { theme: Theme }) => ({
  all: 'unset',

  ...cardStyle({ ...props, bordered: true }),

  ':hover': { borderColor: colorsV3.gray700 },
  ':focus': { borderColor: colorsV3.gray700 },
  cursor: 'pointer',
  // Make border thicker when checked
  // Adjust padding so that content doesn't shift
  borderWidth: props.checked ? '2px' : '1px',

  // @ts-ignore TS doesn't like to use component name for selectors, but it works
  [CardContent]: {
    padding: props.checked ? 'calc(1rem - 1px) calc(0.5rem - 1px)' : '1rem 0.5rem',

    [mq.md]: {
      padding: props.checked ? 'calc(1rem - 1px)' : '1rem',
    },
  },
})

// @ts-ignore TS doesn't like passing a function to return a CSS object
const StyledCheckbox = styled(Checkbox.Root)<SelectableCardProps>((props) =>
  selectableCardStyles(props),
)

// @ts-ignore TS doesn't like passing a function to return a CSS object
const StyledRadio = styled(RadioGroup.Item)<SelectableCardProps>((props) =>
  selectableCardStyles(props),
)

export const SelectableCard = ({ as: asProp, onChange, id, ...props }: SelectableCardProps) => {
  if (asProp === 'radio') {
    if (!id) {
      throw new Error('Id must be defined on SelectableCard when rendered as a radio')
    }
    return <StyledRadio {...props} id={id} value={id} />
  } else {
    return <StyledCheckbox {...props} onCheckedChange={onChange} />
  }
}
