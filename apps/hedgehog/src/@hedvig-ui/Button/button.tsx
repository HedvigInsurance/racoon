'use client'

import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import _chroma from 'chroma-js'
import { ButtonHTMLAttributes, useState } from 'react'
import { Flex } from '../Flex/flex'

// Necessary for tests to run - if not, theme colors used might be undefined at test-time
const chroma = (c: string) => _chroma(c ?? 'white')

const color = ({
  theme,
  variant = 'primary',
  status,
  disabled = false,
}: ButtonProps & { theme: Theme }) => {
  if (disabled) {
    return css`
      color: ${chroma(theme.semiStrongForeground).brighten(0.5).hex()};
    `
  }

  if (status === 'success') {
    return css`
      color: ${theme.accentContrast};
    `
  }
  if (status === 'warning') {
    return css`
      color: ${theme.accentContrast};
    `
  }
  if (status === 'danger') {
    return css`
      color: ${theme.accentContrast};
    `
  }

  if (variant === 'primary') {
    return css`
      color: ${theme.accentContrast};
    `
  }

  if (variant === 'secondary') {
    return css`
      color: ${theme.accent};
    `
  }

  if (variant === 'tertiary') {
    return css`
      color: ${theme.accent};
    `
  }
}

const backgroundColor = ({
  theme,
  variant = 'primary',
  status,
  disabled = false,
}: ButtonProps & { theme: Theme }) => {
  if (disabled) {
    if (variant === 'tertiary') return 'background: transparent;'

    return css`
      background-color: ${chroma(theme.mutedBackground).darken(0.4).hex()};
    `
  }

  if (status === 'success') {
    return css`
      background-color: ${theme.success};

      :hover {
        background-color: ${chroma(theme.success).brighten(0.5).hex()};
      }
    `
  }

  if (status === 'warning') {
    return css`
      background-color: ${theme.warning};

      :hover {
        background-color: ${chroma(theme.warning).brighten(0.5).hex()};
      }
    `
  }

  if (status === 'danger') {
    return css`
      background-color: ${theme.danger};

      :hover {
        background-color: ${chroma(theme.danger).brighten(0.5).hex()};
      }
    `
  }

  if (variant === 'primary') {
    return css`
      background-color: ${theme.accent};

      :hover {
        background-color: ${chroma(theme.accent).brighten(0.5).hex()};
      }
    `
  }

  if (variant === 'secondary') {
    return css`
      background-color: ${theme.accentLight};

      :hover {
        background-color: ${chroma(theme.accentLight).brighten(0.2).hex()};
      }
    `
  }

  if (variant === 'tertiary') {
    return css`
      background-color: transparent;

      :hover {
        background-color: ${chroma(theme.accentLight).brighten(0.2).hex()};
      }
    `
  }
}

const border = () => {
  return css`
    border: none;
    border-radius: 6px;
  `
}

const paddingSize: Record<'small' | 'medium' | 'large', string> = {
  small: 'padding: 0.5rem 0.75rem',
  medium: 'padding: 0.75rem 1rem',
  large: 'padding: 1rem 1.5rem;',
}

const padding = ({ size = 'medium' }: ButtonProps) => paddingSize[size]

const fontSize = ({ size = 'medium' }) => {
  if (size === 'small') {
    return css`
      font-size: 0.75rem;
    `
  }

  if (size === 'medium') {
    return css`
      font-size: 1rem;
    `
  }

  if (size === 'large') {
    return css`
      font-size: 1.5rem;
    `
  }
}

const cursor = ({ disabled = false }) =>
  disabled
    ? css`
        cursor: not-allowed;
      `
    : css`
        cursor: pointer;
      `

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary'
  status?: 'success' | 'warning' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  icon?: React.ReactNode
  children?: React.ReactNode
}

const ButtonIcon = styled.div<{ size?: 'small' | 'medium' | 'large' }>`
  svg {
    margin-bottom: -6%;
  }
`

const ButtonIconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const ButtonConfirm = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  translate: -50% 0;
  border-radius: 0.4rem;
  background-color: #fafafa;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
`

export const ConfirmingButtonsWrapper = ({
  onClick,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [isConfirming, setIsConfirming] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      {isConfirming && (
        <ButtonConfirm>
          <Flex gap="tiny">
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                setIsConfirming(false)
                onClick?.(e)
              }}
              status={props.status}
            >
              Confirm
            </Button>
            <Button
              size="small"
              variant="tertiary"
              onClick={(e) => {
                e.stopPropagation()
                setIsConfirming(false)
              }}
            >
              Cancel
            </Button>
          </Flex>
        </ButtonConfirm>
      )}
      <Button {...props} onClick={() => setIsConfirming(true)} />
    </div>
  )
}

const ButtonWithoutStyles = ({
  icon,
  children,
  ...props
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props}>
      <ButtonIconWrapper>
        {!!icon && <ButtonIcon size={props.size}>{icon}</ButtonIcon>}
        <div>{children}</div>
      </ButtonIconWrapper>
    </button>
  )
}

export const Button = styled(ButtonWithoutStyles)`
  font-family: inherit;
  transition: all 200ms;
  white-space: nowrap;

  * {
    transition: all 200ms;
  }

  ${cursor};
  ${color};
  ${backgroundColor};
  ${border};
  ${padding};
  ${fontSize};

  &:focus {
    opacity: 0.8;
  }
`

export const ButtonsGroup = styled.div`
  width: 100%;
  display: flex;

  * + * {
    margin-left: 1rem;
  }
`
