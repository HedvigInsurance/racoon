import {
  Dropdown,
  DropdownOption,
  Flex,
  Label,
  useConfirmDialog,
} from '@hedvig-ui'
import { useAuthAdmin } from '../hooks/use-auth-admin'

export const SelectAuthGroup = () => {
  const { authGroups, selectedGroup, hasPermissionChanges, selectGroup } =
    useAuthAdmin()

  const { confirm } = useConfirmDialog()
  return (
    <Flex direction="column">
      <Label>Auth group</Label>
      <Dropdown placeholder="Select a group to manage permissions">
        {authGroups.map((group) => (
          <DropdownOption
            key={group.id}
            onClick={() => {
              if (selectedGroup?.id === group.id) return
              if (!hasPermissionChanges) {
                selectGroup(group)
                return
              }
              confirm(
                'You have unsaved changes, do you want to discard them?',
                'danger',
                'Discard changes',
              ).then(() => selectGroup(group))
            }}
            selected={selectedGroup?.id === group.id}
          >
            {group.oktaName}
          </DropdownOption>
        ))}
      </Dropdown>
    </Flex>
  )
}
