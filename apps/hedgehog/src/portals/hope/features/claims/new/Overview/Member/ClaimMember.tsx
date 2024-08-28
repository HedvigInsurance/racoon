import { useState } from 'react'
import { Collapsible, Loadable } from '@hedvig-ui'
import { Grid } from '@hedvig-ui/redesign'
import { section, sectionHeader, sectionTitle } from '../section.css'
import { useClaim } from '../../../hooks/use-claim'
import { TagsNew } from '../../Tags/TagsNew'
import { ClaimMemberDetails } from './components'
import { ExpandToggler } from '../ExpandToggler'
import clsx from 'clsx'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const ClaimMember = () => {
  const { member, loading } = useClaim()
  const [showMemberDetails, setShowMemberDetails] = useState(false)
  const toggleShowMemberDetails = () => setShowMemberDetails((prev) => !prev)

  return (
    <Loadable loading={loading}>
      <section className={section}>
        <div
          className={clsx(sectionHeader, cssUtil.pointer)}
          onClick={toggleShowMemberDetails}
        >
          <p className={sectionTitle}>Member details</p>
          <ExpandToggler active={showMemberDetails} />
        </div>

        <TagsNew resourceId={member.memberId} tags={member.tags ?? []} />

        <Collapsible collapsed={!showMemberDetails}>
          <Grid equalColumns={2} columnGap="small">
            <ClaimMemberDetails />
          </Grid>
        </Collapsible>
      </section>
    </Loadable>
  )
}
