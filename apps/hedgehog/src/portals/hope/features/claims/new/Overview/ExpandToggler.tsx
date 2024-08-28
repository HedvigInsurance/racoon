import { ChevronDownIcon, IconButton } from '@hedvig-ui/icons'
import { LegacyTooltip } from '@hedvig-ui/redesign'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const ExpandToggler = ({ active }: { active: boolean }) => {
  return (
    <LegacyTooltip content="Expand">
      <IconButton>
        <ChevronDownIcon
          className={active ? cssUtil.rotated180 : cssUtil.rotatable}
        />
      </IconButton>
    </LegacyTooltip>
  )
}
