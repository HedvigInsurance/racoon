import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'
import { EntrypointFragment } from 'types/generated/graphql'
import { useEntrypoints } from '../hooks'
import { EditEntrypointModal } from './EditEntrypointModal'
import { Button, Spinner } from '@hedvig-ui'
import { SortAlphaDown, SortAlphaUp } from 'react-bootstrap-icons'
import { EntrypointListEntry } from './EntrypointListEntry'
import { css } from '@emotion/react'

const ListGridLayout = styled.div`
  display: grid;
  grid-template-columns: 5rem repeat(5, 1fr);

  span {
    padding: 0.5rem 1rem;
    border-left: 1px solid;
    display: grid;
    align-items: center;
    word-break: break-all;
  }
`

const ListHeader = styled(ListGridLayout)`
  font-weight: bold;
  border: 1px solid;
  border-left: 0;
  border-color: ${({ theme }) => theme.border};

  span {
    border-color: ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.accentBackground};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`

const SortButton = styled(Button)`
  transition: all 50ms ease;
  * {
    transition: all 50ms ease;
  }
`

const ListHeaderColumn = ({
  children,
  value,
}: {
  children?: ReactNode
  value: keyof EntrypointFragment
}) => {
  const { sortDirection, sortField, updateSortField } = useEntrypoints()
  const [isHovering, setIsHovering] = useState(false)
  const isActiveColumn = sortField === value
  return (
    <span
      onClick={() => updateSortField(value)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ cursor: 'pointer' }}
    >
      {children}
      <SortButton
        style={{ padding: '0.25rem' }}
        variant={
          isHovering ? 'secondary' : isActiveColumn ? 'primary' : 'tertiary'
        }
        icon={sortDirection < 0 ? <SortAlphaUp /> : <SortAlphaDown />}
      />
    </span>
  )
}

const ListRow = styled(ListGridLayout)<{ deactivated: boolean }>`
  border-bottom: 1px solid;
  border-right: 1px solid;
  border-color: ${({ theme }) => theme.border};

  ${({ deactivated }) =>
    deactivated &&
    css`
      > * {
        opacity: 0.5;
      }
    `}

  span {
    border-color: ${({ theme }) => theme.border};
  }
`

const SpinnerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 4rem;
  font-size: 3rem;
`

export const EntrypointList = () => {
  const {
    entrypoints,
    isLoadingEntrypoints,
    selectedEntrypoint,
    setSelectedEntrypointId,
  } = useEntrypoints()

  return (
    <div>
      {!!selectedEntrypoint && (
        <EditEntrypointModal
          onClose={() => setSelectedEntrypointId(undefined)}
        />
      )}
      <ListHeader>
        <span></span>
        <ListHeaderColumn value="displayName">Display name</ListHeaderColumn>
        <ListHeaderColumn value="acceptLanguage">Locale</ListHeaderColumn>
        <span>Keywords</span>
        <ListHeaderColumn value="createdAt">Created</ListHeaderColumn>
      </ListHeader>
      {isLoadingEntrypoints ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : (
        entrypoints.map((entrypoint) => (
          <ListRow key={entrypoint.id} deactivated={!!entrypoint.removedAt}>
            <EntrypointListEntry entrypoint={entrypoint} />
          </ListRow>
        ))
      )}
    </div>
  )
}
