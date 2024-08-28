import { useState } from 'react'
import { Input } from '@hedvig-ui'
import { Flex, Button } from '@hedvig-ui'
import { useAuthGroup } from '../hooks/use-auth-group'

export const AddAuthGroup = () => {
  const { createAuthGroup } = useAuthGroup()
  const [groupName, setGroupName] = useState('')
  return (
    <Flex direction="column" gap="medium">
      <Flex justify="start" gap="small" flex="0">
        <div>
          <Input
            onChange={({ currentTarget: { value } }) => setGroupName(value)}
            value={groupName}
          />
        </div>
        <Button
          disabled={!groupName}
          onClick={async () => {
            await createAuthGroup(groupName)
            setGroupName('')
          }}
        >
          Create group +
        </Button>
      </Flex>
    </Flex>
  )
}
