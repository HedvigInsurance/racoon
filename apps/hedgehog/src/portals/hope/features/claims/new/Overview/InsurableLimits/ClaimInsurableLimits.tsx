import { useState } from 'react'
import { useClaim } from '../../../hooks/use-claim'
import { section, sectionHeader, sectionTitle } from '../section.css'
import { Collapsible, Modal } from '@hedvig-ui'
import { Button, Flex, Grid, Hr } from '@hedvig-ui/redesign'
import {
  ClaimInsurableLimitsDetails,
  TotalInsurableLimits,
  EditInsurableLimits,
} from './components'
import { ExpandToggler } from '../ExpandToggler'
import clsx from 'clsx'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const ClaimInsurableLimits = () => {
  const { insurableLimits } = useClaim()
  const [showInsuranceLimits, setShowInsuranceLimits] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const toggleShowInsuranceLimits = () =>
    setShowInsuranceLimits((prev) => !prev)

  if (!insurableLimits) {
    return null
  }

  return (
    <>
      <section className={section}>
        <div
          className={clsx(sectionHeader, cssUtil.pointer)}
          onClick={toggleShowInsuranceLimits}
        >
          <p className={sectionTitle}>Insurance limits</p>
          <ExpandToggler active={showInsuranceLimits} />
        </div>

        <TotalInsurableLimits insurableLimits={insurableLimits} />

        <Collapsible collapsed={!showInsuranceLimits}>
          <Grid mt="medium" rowGap="medium">
            <Hr />
            <ClaimInsurableLimitsDetails insurableLimits={insurableLimits} />
          </Grid>
          <Flex justify={'flex-end'} pt={'small'}>
            <Button
              variant={'secondary'}
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
          </Flex>
        </Collapsible>
      </section>

      <Modal visible={showEditModal} onClose={() => setShowEditModal(false)}>
        <EditInsurableLimits insurableLimits={insurableLimits} />
      </Modal>
    </>
  )
}
