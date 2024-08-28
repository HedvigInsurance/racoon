import { useHasPermission } from '@hope/common/hooks/use-has-permission'
import { useUserStatus } from '@hope/features/tasks/hooks/use-user-status'
import { Keys } from '@hedvig-ui'
import { Flex, Button } from '@hedvig-ui/redesign'
import * as React from 'react'
import { CommandHotkey } from '../commands/components/CommandHotkey'
import { css } from './CheckInMessage.css'

export const CheckInMessage: React.FC = () => {
  const { hasPermission } = useHasPermission('inbox')
  const { checkIn } = useUserStatus()

  return (
    <Flex justify="space-between" gap="large">
      <div>
        <p className={css.heading}>Check in to start helping members</p>
        <p className={css.headingDescription}>
          When checked in, you will be assigned members for your given
          preferences.
          <br /> These members will then be added to your inbox under "My inbox"
        </p>
      </div>
      <Flex direction="column" gap="xxs" align="flex-end">
        <CommandHotkey
          text="Check in"
          keys={[Keys.Option, Keys.Enter]}
          disabled={!hasPermission}
          onResolve={checkIn}
        >
          <Button size="large" onClick={checkIn} disabled={!hasPermission}>
            Check in
          </Button>
        </CommandHotkey>

        {!hasPermission && (
          <p className={css.permissionMessage}>Only available for IEX</p>
        )}
      </Flex>
    </Flex>
  )
}
