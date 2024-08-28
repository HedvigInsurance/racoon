import { ReactNode, HTMLAttributes } from 'react'
import { colors } from '@hedvig-ui/redesign/palette'
import { css } from '@emotion/react'
import { Key } from '@hedvig-ui'
import { Flex } from '@hedvig-ui/redesign'
import styled from '@emotion/styled'

type DataProps = {
  title: ReactNode
  action: () => void
  hotkey?: { name: string; key: Key }
  badge?: ReactNode
}

type StyleProps = {
  active: boolean
}

export type TabProps = DataProps &
  Partial<StyleProps> &
  HTMLAttributes<HTMLDivElement>

export const Tab = (props: TabProps) => {
  const { children, title, badge, active = false, action, ...rest } = props
  return (
    <StyledTab
      p="sm"
      align="center"
      justify="center"
      gap="tiny"
      active={active}
      onClick={() => !active && action()}
      {...rest}
    >
      {children ?? title}
      {badge}
    </StyledTab>
  )
}

const StyledTab = styled(Flex)<StyleProps>`
  border-radius: 10px;
  text-align: center;

  ${({ active }) =>
    active
      ? css`
          cursor: default;
          background-color: ${colors.buttonPrimary};
          color: ${colors.textNegative};
        `
      : css`
          cursor: pointer;
          color: ${colors.textSecondary};

          &:hover {
            background-color: ${colors.buttonSecondaryHover};
          }
        `}
`
