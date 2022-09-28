import styled from '@emotion/styled'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { InputBase, InputBaseProps } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { TickIcon } from './TickIcon'

const Item = styled(RadioGroup.Item)(({ theme }) => ({
  padding: 0,
  backgroundColor: theme.colors.white,
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  borderRadius: '0.5rem',
  width: '100%',

  border: '2px solid transparent',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',

  '&[data-state=checked]': {
    borderColor: theme.colors.gray900,
  },

  '&:focus': {
    borderColor: theme.colors.purple500,
  },
}))

const InnerWrapper = styled.div({
  padding: '1rem',
  display: 'flex',
  gap: '1rem',
})

const IndicatorWrapper = styled.div(({ theme }) => ({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '1.375rem',
  width: '1.375rem',
  border: `1px solid ${theme.colors.gray900}`,
  borderRadius: '0.75rem',
  cursor: 'pointer',
  flexShrink: 0,
}))

const Indicator = styled(RadioGroup.Indicator)(({ theme }) => ({
  backgroundColor: theme.colors.gray900,
  borderRadius: '0.75rem',
  width: '100%',
  height: '100%',
}))

type InputRadioProps = InputBaseProps & {
  name: string
  options: Array<{ label: string; value: string }>
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  required?: boolean
  placeholder?: string
  autoFocus?: boolean
}

export const InputRadio = ({
  options,
  name,
  onValueChange,
  value,
  defaultValue,
  required,
  autoFocus,
  ...rest
}: InputRadioProps) => {
  return (
    <InputBase {...rest}>
      {() => (
        <RadioGroup.Root
          defaultValue={defaultValue}
          value={value}
          onValueChange={onValueChange}
          name={name}
          required={required}
        >
          <SpaceFlex direction="horizontal" space={0.5}>
            {options.map(({ label, value: optionValue }, index) => (
              <Item key={optionValue} value={optionValue} autoFocus={autoFocus && index === 0}>
                <InnerWrapper>
                  <IndicatorWrapper>
                    <Indicator>
                      <TickIcon size={20} />
                    </Indicator>
                  </IndicatorWrapper>

                  {label}
                </InnerWrapper>
              </Item>
            ))}
          </SpaceFlex>
        </RadioGroup.Root>
      )}
    </InputBase>
  )
}
