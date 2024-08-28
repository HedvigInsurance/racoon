import {
  DetailedHTMLProps,
  DetailsHTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from 'react'
import * as React from 'react'
import { Flex, isPressing, Keys, Label, SpacingSize } from '@hedvig-ui'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

const StyledRadioCircle = styled.div<{ checked?: boolean }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;

  position: relative;

  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};

  ${({ checked, theme }) =>
    checked &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
        width: 0.625rem;
        height: 0.625rem;
        border-radius: 50%;
        background-color: ${theme.semiStrongForeground};
      }
    `};
`
const StyledOptionText = styled.p`
  flex-grow: 1;
`

export const useRadioGroup = <T,>({
  initialValue,
  label,
  options,
}: {
  initialValue?: T
  label?: string
  options: { text: string; value: T }[]
}) => {
  const [value, setValue] = useState<T>(initialValue ?? options[0].value)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, newValue: T) => {
      if (isPressing(e, Keys.Enter)) {
        e.preventDefault()
        setValue(newValue as unknown as T)
      }
    },
    [],
  )

  return {
    value,
    setValue,
    component: useMemo(
      () =>
        ({
          style,
          direction,
          gap,
        }: DetailedHTMLProps<
          DetailsHTMLAttributes<HTMLElement>,
          HTMLElement
        > & {
          direction?: 'row' | 'column'
          gap?: SpacingSize
        }) => {
          return (
            <div style={style}>
              {label && <Label>{label}</Label>}
              <Flex direction={direction ?? 'column'} gap={gap ?? 'fraction'}>
                {options.map((option) => (
                  <Flex
                    key={option.value as unknown as string}
                    align="center"
                    gap="tiny"
                    onClick={() => setValue(option.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <StyledRadioCircle
                      tabIndex={0}
                      checked={value === option.value}
                      onKeyDown={(e) => handleKeyDown(e, option.value)}
                    />
                    <StyledOptionText>{option.text}</StyledOptionText>
                  </Flex>
                ))}
              </Flex>
            </div>
          )
        },
      [value, options, handleKeyDown, label],
    ),
  }
}
