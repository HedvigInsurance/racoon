import * as React from 'react'
import { Flex } from '@hedvig-ui'
import { AddAuthGroup } from './AddAuthGroup'
import { SelectAuthGroup } from './SelectAuthGroup'
import { ManageGroupPermissions } from './ManageGroupPermissions'
import { useAuthAdmin } from '../hooks/use-auth-admin'

export const ManageAuthGroups: React.FC = () => {
  const { selectedGroup } = useAuthAdmin()
  return (
    <Flex direction="column" gap="small" style={{ width: '50%' }}>
      <AddAuthGroup />
      <SelectAuthGroup />
      {selectedGroup && <ManageGroupPermissions />}
    </Flex>
  )
}
