import styled from '@emotion/styled'
import { Flex, Modal, Shadowed, Tabs } from '@hedvig-ui'
import chroma from 'chroma-js'
import { RoleAccessList } from '@hope/features/resource-access/overview/components/RoleAccessList'
import { UserAccessList } from '@hope/features/resource-access/overview/components/UserAccessList'
import { useState } from 'react'
import * as React from 'react'
import { ResourceAccessInformation } from 'types/generated/graphql'

const Footer = styled(Flex)`
  font-size: 0.85rem;
  margin-top: 0.2rem;
  padding: 1rem;
  color: ${({ theme }) => chroma(theme.foreground).alpha(0.7).hex()};
`

const Container = styled(Flex)`
  width: 500px;
  height: 400px;
  padding: 0 1rem;
  overflow-y: scroll;
`

export const ResourceAccessOverview: React.FC<{
  resourceAccess: ResourceAccessInformation
  onClose: () => void
  visible: boolean
}> = ({ resourceAccess, onClose, visible }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')

  return (
    <Modal onClose={onClose} style={{ padding: '1rem' }} visible={visible}>
      <Tabs
        style={{ margin: '1rem 0', padding: '0rem 1rem' }}
        list={[
          {
            title: 'Users',
            action: () => {
              setActiveTab('users')
            },
            active: activeTab === 'users',
          },

          {
            title: 'Roles',
            action: () => {
              setActiveTab('roles')
            },
            active: activeTab === 'roles',
          },
        ]}
      />
      <Container direction="column">
        {activeTab === 'users' && (
          <UserAccessList resourceAccessInformation={resourceAccess} />
        )}
        {activeTab === 'roles' && (
          <RoleAccessList resourceAccessInformation={resourceAccess} />
        )}
      </Container>

      {!resourceAccess.restrictedByMe && (
        <Footer justify="center" align="center">
          Only{' '}
          <Shadowed style={{ margin: '0 0.2rem' }}>
            {resourceAccess.restrictedBy.fullName}
          </Shadowed>{' '}
          can grant access
        </Footer>
      )}
    </Modal>
  )
}
