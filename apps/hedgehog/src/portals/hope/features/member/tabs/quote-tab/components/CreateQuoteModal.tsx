import * as React from 'react'
import { InsuranceType } from '@hope/features/config/constants'
import { Modal } from '@hedvig-ui'
import { CreateQuoteForm } from '@hope/features/member/tabs/quote-tab/components/CreateQuoteForm'
import styled from '@emotion/styled'

const CreateQuoteWrapper = styled.div`
  padding: 0.8rem;
`

export const CreateQuoteModal: React.FC<{
  onClose: () => void
  onSubmit?: () => void
  memberId: string
  insuranceType: InsuranceType
  visible: boolean
}> = ({ onClose, onSubmit, memberId, insuranceType, visible }) => {
  return (
    <Modal
      onClose={onClose}
      style={{ width: '50rem', padding: '1rem' }}
      visible={visible}
    >
      <CreateQuoteWrapper>
        <CreateQuoteForm
          memberId={memberId}
          insuranceType={insuranceType}
          onCancel={onClose}
          onSubmitted={() => {
            onSubmit?.()
            onClose()
          }}
        />
      </CreateQuoteWrapper>
    </Modal>
  )
}
