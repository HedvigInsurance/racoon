import { ReactNode, useState } from 'react'
import styled from '@emotion/styled'
import { useAuthAdmin } from '../hooks/use-auth-admin'
import { Flex, Label, Placeholder } from '@hedvig-ui'
import { DashSquare, Icon, PlusSquare } from 'react-bootstrap-icons'
import { SaveGroupPermissions } from './SaveGroupPermissions'

const List = styled.div`
  background-color: ${({ theme }) => theme.backgroundLight};
  width: 100%;
  box-shadow: 0 2px 10px 0 rgba(34, 60, 80, 0.2);
  height: 100%;
`

const ListSection = styled.div`
  width: 100%;
`

const ListSectionHeader = styled.div`
  padding: 0.5rem;
  background-color: #eee;
`

const ListItem = styled(Label)`
  cursor: pointer;
  padding: 0.5rem;
  margin: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background-color: ${({ theme }) => theme.backgroundLight};

  &:hover {
    background-color: #f5f5f5;
  }
`

const TemporaryListItem = ({
  children,
  onAction,
  ActionIcon,
}: {
  onAction: () => void
  children: ReactNode
  ActionIcon: Icon
}) => {
  const [showActionButton, setShowActionButton] = useState(false)
  return (
    <ListItem
      onMouseEnter={() => setShowActionButton(true)}
      onMouseLeave={() => setShowActionButton(false)}
      onClick={onAction}
    >
      {children}
      {showActionButton && <ActionIcon />}
    </ListItem>
  )
}

export const ManageGroupPermissions = () => {
  const {
    allPermissions,
    updatedPermissions,
    setUpdatedPermissions,
    addedPermissions,
    removedPermissions,
  } = useAuthAdmin()

  const togglePermission = ({
    checked,
    domain,
    permission,
  }: {
    checked: boolean
    domain: string
    permission: string
  }) => {
    if (checked) {
      setUpdatedPermissions((prev) => ({
        ...prev,
        [domain]: [...new Set([...(prev?.[domain] ?? []), permission])],
      }))
    } else {
      setUpdatedPermissions((prev) => ({
        ...prev,
        [domain]: prev?.[domain]
          ? prev[domain].filter((current) => current !== permission)
          : [],
      }))
    }
  }

  return (
    <>
      <SaveGroupPermissions style={{ marginLeft: 'auto' }} />

      <Flex gap="small">
        <List>
          {Object.entries(allPermissions).map(([domain, permissions]) => (
            <ListSection key={domain}>
              <ListSectionHeader>{domain}</ListSectionHeader>
              <Flex direction="column">
                {permissions.map((permission) => {
                  const checked =
                    updatedPermissions?.[domain]?.includes(permission) ?? false

                  return (
                    <ListItem as={Label} key={permission}>
                      {permission}
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          togglePermission({
                            checked: event.target.checked,
                            domain,
                            permission,
                          })
                        }
                      />
                    </ListItem>
                  )
                })}
              </Flex>
            </ListSection>
          ))}
        </List>

        <List>
          <ListSection>
            <ListSectionHeader>Added</ListSectionHeader>
            {addedPermissions.map(({ domain, permission }) => (
              <TemporaryListItem
                key={domain + permission}
                onAction={() =>
                  togglePermission({ checked: false, domain, permission })
                }
                ActionIcon={DashSquare}
              >
                <span>
                  {domain}, {permission}
                </span>
              </TemporaryListItem>
            ))}
            {!addedPermissions.length && (
              <ListItem>
                <Placeholder>No permissions added</Placeholder>
              </ListItem>
            )}
          </ListSection>

          <ListSection>
            <ListSectionHeader>Removed</ListSectionHeader>
            {removedPermissions.map(({ domain, permission }) => (
              <TemporaryListItem
                key={domain + permission}
                onAction={() =>
                  togglePermission({ checked: true, domain, permission })
                }
                ActionIcon={PlusSquare}
              >
                <span>
                  {domain}, {permission}
                </span>
              </TemporaryListItem>
            ))}
            {!removedPermissions.length && (
              <ListItem style={{ pointerEvents: 'none' }}>
                <Placeholder>No permissions removed</Placeholder>
              </ListItem>
            )}
          </ListSection>
        </List>
      </Flex>
    </>
  )
}
