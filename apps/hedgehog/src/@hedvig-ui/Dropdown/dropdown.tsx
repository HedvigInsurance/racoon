'use client'

import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import {
  Children,
  ForwardedRef,
  HTMLAttributes,
  LiHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react'

import * as React from 'react'
import { TriangleFill } from 'react-bootstrap-icons'
import {
  isPressing,
  Keys,
  useClickOutside,
  useVerticalKeyboardNavigation,
} from '@hedvig-ui'

const show = keyframes`
  from {
    opacity: 0;
    transform: translate(0, -50px);
  }

  to {
    opacity: 1;
    transform: translate(0, 0);
  }
`

const DropdownStyled = styled.div<{
  isActive: boolean
  position?: 'top' | 'bottom'
}>`
  width: 100%;
  position: relative;
  outline: none;

  & ul,
  & li {
    list-style: none;
  }

  & > li:first-of-type {
    border-radius: 0.3rem;
    border: 1px solid ${({ theme }) => theme.border};
    padding-right: 30px;
  }

  &:focus {
    & > li:first-of-type {
      background-color: ${({ theme }) => theme.accentBackground};
    }
  }
`

const OptionsList = styled.ul<{
  activeOption: number
  position?: 'top' | 'bottom'
}>`
  margin: 0;
  padding-left: 0;

  position: absolute;
  z-index: 10;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;

  ${({ position }) => position === 'top' && 'bottom: 100%;'}

  animation: ${show} 0.15s ease-out;
  background-color: ${({ theme }) => theme.backgroundLight};
  border-radius: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 5px 40px ${({ theme }) => theme.backgroundTransparent};

  & li:last-of-type {
    border-radius: 0 0 0.3rem 0.3rem;
  }

  ${({ activeOption, theme }) => {
    if (activeOption !== -1) {
      return css`
        li:nth-of-type(${activeOption + 1}) {
          background-color: ${theme.accentLighter};
        }
      `
    }
  }}
`

const OptionStyled = styled.li<{ selected: boolean }>`
  display: flex;
  align-items: center;

  overflow: hidden;

  font-size: 14px;

  outline: none;
  cursor: pointer;
  padding: 10px 15px;
  background-color: ${({ theme, selected }) =>
    !selected ? theme.backgroundLight : theme.accentBackground};

  transition: none;

  &:hover,
  &:focus {
    background-color: ${({ theme, selected }) =>
      !selected ? theme.accentBackground : theme.background};
  }
`

const Placeholder = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.placeholderColor};
`

const TriangleIcon = styled(TriangleFill)<{ active: number }>`
  transition: all 0.2s;
  position: absolute;
  right: 15px;
  top: 40%;
  width: 10px !important;
  height: 10px !important;
  transform: scaleY(${({ active }) => active});
  color: ${({ active, theme }) =>
    active < 0 ? theme.placeholderColor : theme.accent};
`

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  placeholder?: string
  value?: string
  position?: 'top' | 'bottom'
  children: React.ReactNode
}

export const Dropdown = React.forwardRef(
  (
    { placeholder, children, value, position, ...props }: DropdownProps,
    forwardRef: ForwardedRef<HTMLDivElement>,
  ) => {
    const arrayChildren = Children.toArray(children).filter((child) => {
      const castedChild = child as React.ReactElement

      return (
        castedChild.props?.onClick &&
        typeof castedChild?.props?.selected !== 'undefined'
      )
    }) as unknown as Omit<React.ReactElement, 'props'> &
      {
        props: OptionProps
      }[]

    const numberOfOptions = React.Children.count(children)

    const defaultRef = useRef<HTMLDivElement>(null)
    const ref = (forwardRef ?? defaultRef) as React.RefObject<HTMLDivElement>

    const [selectedIdx, setSelectedIdx] = React.useState(0)
    const [active, setActive] = React.useState(false)

    const closeDropdown = async () => {
      setActive(false)
    }

    const [navigationStep] = useVerticalKeyboardNavigation({
      maxStep: numberOfOptions - 1,
      onPerformNavigation: (index) => {
        arrayChildren[index].props.onClick()
        closeDropdown()
      },
      isActive: active,
    })

    const toggleDropdown = async () => {
      if (active) {
        await closeDropdown()
        return
      }

      setActive(true)
    }

    useClickOutside(ref, closeDropdown)

    useEffect(() => {
      if (active) {
        ref.current?.blur()
      } else {
        ref.current?.focus
      }
    }, [active, ref])

    useEffect(() => {
      const hasSelected = !!arrayChildren.find(
        (element) => !!element?.props?.selected,
      )

      if (hasSelected) {
        arrayChildren.forEach((element, index) => {
          if (element?.props?.selected) {
            setSelectedIdx(index + 1)
          }
        })
      } else {
        setSelectedIdx(0)
      }
    }, [arrayChildren])

    useEffect(() => {
      if (navigationStep === -1) {
        setActive(false)
      }
    }, [navigationStep])

    return (
      <DropdownStyled
        tabIndex={0}
        ref={ref}
        isActive={active}
        onKeyDown={async (e) => {
          if (isPressing(e, Keys.Enter)) {
            await toggleDropdown()
            return
          }

          if (isPressing(e, Keys.Enter)) {
            await closeDropdown()
            return
          }
        }}
        {...props}
      >
        {!selectedIdx || !arrayChildren[selectedIdx - 1] ? (
          <OptionStyled
            selected={false}
            tabIndex={-1}
            onClick={numberOfOptions ? toggleDropdown : undefined}
          >
            <Placeholder>{placeholder || 'Dropdown'}</Placeholder>
          </OptionStyled>
        ) : !value ? (
          <Option
            {...arrayChildren[selectedIdx - 1].props}
            tabIndex={-1}
            selected={false}
            onClick={() => toggleDropdown()}
          />
        ) : (
          <OptionStyled selected={false} tabIndex={-1} onClick={toggleDropdown}>
            {value}
          </OptionStyled>
        )}

        {active && (
          <OptionsList position={position} activeOption={navigationStep}>
            {arrayChildren.map((element, index) => (
              <Option
                key={index}
                {...element.props}
                tabIndex={-1}
                onClick={async () => {
                  element.props.onClick()
                  await closeDropdown()
                }}
              />
            ))}
          </OptionsList>
        )}

        {arrayChildren.length > 0 && <TriangleIcon active={active ? 1 : -1} />}
      </DropdownStyled>
    )
  },
)

export interface OptionProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'onClick'> {
  onClick: () => void
  selected: boolean
}

export const Option: React.FC<PropsWithChildren & OptionProps> = ({
  children,
  onClick,
  ...props
}) => (
  <OptionStyled
    tabIndex={0}
    onKeyDown={(e) => {
      if (isPressing(e, Keys.Enter)) {
        onClick()
        return
      }
    }}
    onClick={onClick}
    {...props}
  >
    {children}
  </OptionStyled>
)
