import {
  ClaimsUiVersion,
  useClaimsUiVersion,
} from '@hope/features/claims/hooks/useClaimsUiVersion'
import { Flex, Switch } from '@hedvig-ui'

export const ClaimUiVersionSwitcher = () => {
  const [version, , toggle] = useClaimsUiVersion()

  return (
    <div>
      <Flex direction="row" align="center" gap="fraction">
        <Switch
          onClick={() => {
            toggle()
            window.location.reload()
          }}
          active={version === ClaimsUiVersion.NEW}
        />
        New UI
      </Flex>
    </div>
  )
}
