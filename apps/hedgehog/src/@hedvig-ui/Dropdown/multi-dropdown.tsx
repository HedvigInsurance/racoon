'use client'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useEffect, useRef } from 'react'
import * as React from 'react'
import { X } from 'react-bootstrap-icons'
import {
  convertEnumOrSentenceToTitle,
  isPressing,
  Keys,
  useClickOutside,
} from '@hedvig-ui'

const show = keyframes`
  from {
    opacity: 0;
    top: 0;
  }

  to {
    opacity: 1;
    top: calc(100% + 1px);
  }
`

const StyledDropdown = styled.div<{ active?: boolean }>`
  position: relative;

  display: flex;
  align-items: center;

  border-radius: 0.3rem 0.3rem
    ${({ active }) => (!active ? '0.3rem 0.3rem' : '0 0')};
  padding: 5px;
  background-color: ${({ theme }) => theme.backgroundLight};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  outline: none;

  .placeholder {
    color: ${({ theme }) => theme.placeholderColor};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.accent};
  }
`

const Selected = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;

  flex-wrap: wrap;
  overflow: hidden;

  gap: 5px 5px;
`

const OptionsList = styled.ul`
  margin: 0;
  padding: 0;
  z-index: 10;

  background-color: ${({ theme }) => theme.backgroundLight};
  box-shadow: 0px 9px 8px 0px ${({ theme }) => theme.backgroundTransparent};
  animation: ${show} 0.1s linear;

  position: absolute;
  top: calc(100% + 1px);
  left: -1px;

  &,
  & li:last-of-type {
    border-radius: 0 0 0.3rem 0.3rem;
  }
`

const Option = styled.li<{ selected?: boolean }>`
  padding: 5px 15px;
  list-style: none;
  white-space: nowrap;
  outline: none;
  background-color: ${({ theme, selected }) =>
    !selected ? theme.backgroundLight : theme.accentBackground};

  &:hover,
  &:focus {
    background-color: ${({ theme, selected }) =>
      !selected ? theme.accentBackground : theme.background};
  }
`

const Tag = styled.span`
  height: 100%;
  padding: 0 10px;

  display: flex;
  align-items: center;

  border-radius: 0.3rem;
  background-color: ${({ theme }) => theme.accentLighter};
`

const CloseIcon = styled(X)`
  width: 17px;
  height: 17px;
  cursor: pointer;
`

type DropdownProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  placeholder?: string
  clearHandler: () => void
  open?: boolean
  onChange: (value: string) => void
}

type StructuredOption = {
  key: string
  value: string
  text: string
}

type DropDownPropsWithStructuredOptions = {
  value: StructuredOption[] | null
  options: StructuredOption[]
} & DropdownProps

type DropDownPropsWithStringOptions = {
  value: string[] | null
  options: string[]
} & DropdownProps

const isWithStringOptions = (
  props: DropDownPropsWithStringOptions | DropDownPropsWithStructuredOptions,
): props is DropDownPropsWithStringOptions => {
  return typeof props.options[0] === 'string'
}

export const MultiDropdown: React.FC<
  DropDownPropsWithStringOptions | DropDownPropsWithStructuredOptions
> = (props) => {
  const { open } = props
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(open || false)

  useClickOutside(dropdownRef, () => setActive(false))

  useEffect(() => {
    setActive(open || false)
  }, [open])

  if (isWithStringOptions(props)) {
    const { options, placeholder, onChange, value, clearHandler, ...rest } =
      props
    return (
      <StyledDropdown
        ref={dropdownRef}
        tabIndex={0}
        active={active}
        onClick={() => !value?.length && setActive(true)}
        onKeyDown={(e) => {
          if (isPressing(e, Keys.Enter) && !value?.length) {
            setActive(true)
            return
          }
          if (isPressing(e, Keys.Escape)) {
            setActive(false)
            return
          }
        }}
        {...rest}
      >
        {value && value.length ? (
          <>
            <Selected onClick={() => setActive((prev) => !prev)}>
              {value.map((option) => (
                <Tag key={option}>{convertEnumOrSentenceToTitle(option)}</Tag>
              ))}
            </Selected>
            <CloseIcon onClick={clearHandler} />
          </>
        ) : (
          <span className="placeholder">{placeholder || 'Dropdown'}</span>
        )}
        {active && (
          <OptionsList>
            {options.map((option) => (
              <Option
                key={option}
                selected={value?.includes(option)}
                tabIndex={0}
                onClick={() => onChange(option)}
              >
                {convertEnumOrSentenceToTitle(option)}
              </Option>
            ))}
          </OptionsList>
        )}
      </StyledDropdown>
    )
  }

  const { options, placeholder, onChange, value, clearHandler, ...rest } = props
  return (
    <StyledDropdown
      ref={dropdownRef}
      tabIndex={0}
      active={active}
      onClick={() => !value?.length && setActive(true)}
      onKeyDown={(e) => {
        if (isPressing(e, Keys.Enter) && !value?.length) {
          setActive(true)
          return
        }
        if (isPressing(e, Keys.Escape)) {
          setActive(false)
          return
        }
      }}
      {...rest}
    >
      {value && value.length ? (
        <>
          <Selected onClick={() => setActive((prev) => !prev)}>
            {value.map((option) => (
              <Tag key={option.key}>{option.text}</Tag>
            ))}
          </Selected>
          <CloseIcon onClick={clearHandler} />
        </>
      ) : (
        <span className="placeholder">{placeholder || 'Dropdown'}</span>
      )}
      {active && (
        <OptionsList>
          {options.map((option) => (
            <Option
              key={option.key}
              selected={!!value?.find(({ value }) => value === option.value)}
              tabIndex={0}
              onClick={() => onChange(option.value)}
            >
              {option.text}
            </Option>
          ))}
        </OptionsList>
      )}
    </StyledDropdown>
  )
}
