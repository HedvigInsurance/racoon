import styled from '@emotion/styled'
import { Button, Flex } from '@hedvig-ui'
import { HTMLAttributes } from 'react'
import * as React from 'react'

interface AccessListItemProps extends HTMLAttributes<HTMLDivElement> {
  access?: boolean
  spacing: boolean
  canGrant?: boolean
  onGrant?: () => void
  isGrantHolder?: boolean
  canRemoveAccess?: boolean
  onRemoveAccess?: () => void
}

const Wrapper = styled.div<{
  access?: boolean
  spacing: 'true' | 'false'
}>`
  font-size: 1rem;
  background-color: ${({ theme, access = false }) =>
    access ? theme.accentLighter : theme.backgroundTransparent};
  color: ${({ theme, access }) => (access ? theme.accent : theme.foreground)};
  padding: 0.5em 0.9em;
  border-radius: 6px;
  width: 100%;
  margin-top: ${({ spacing }) => (spacing === 'true' ? '0.5rem' : '0')};
`

export const AccessListItem: React.FC<AccessListItemProps> = ({
  children,
  canGrant,
  onGrant,
  isGrantHolder,
  canRemoveAccess,
  onRemoveAccess,
  spacing,
  ...props
}) => {
  return (
    <Wrapper spacing={spacing ? 'true' : 'false'} {...props}>
      <Flex align="center" justify="space-between">
        {children}
        {isGrantHolder ? (
          <span style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
            Grant holder
          </span>
        ) : (
          canRemoveAccess && (
            <Button size="small" variant="secondary" onClick={onRemoveAccess}>
              Remove access
            </Button>
          )
        )}
        {onGrant !== undefined && (
          <Button size="small" variant="tertiary" onClick={onGrant}>
            Grant access
          </Button>
        )}
      </Flex>
    </Wrapper>
  )
}
