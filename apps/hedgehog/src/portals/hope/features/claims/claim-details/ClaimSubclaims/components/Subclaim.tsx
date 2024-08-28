import {
  CardTitle,
  Copyable,
  Flex,
  FourthLevelHeadline,
  InfoTag,
  Keys,
  Label,
  MainHeadline,
  Modal,
  Popover,
  Spacing,
} from '@hedvig-ui'
import { SubclaimType } from '@hope/features/claims/claim-details/ClaimSubclaims/components/SubclaimType/SubclaimType'
import { SubclaimOutcomeDropdown } from '@hope/features/claims/claim-details/ClaimInformation/components/SubclaimOutcomeDropdown'
import { SubclaimCause } from '@hope/features/claims/claim-details/ClaimSubclaims/components/SubclaimCause'
import { getCarrierText } from '@hope/features/contracts/utils'
import { SubclaimPaymentOrders } from '@hope/features/claims/claim-details/SubclaimPaymentOrders'
import { SubclaimRecovery } from '@hope/features/claims/claim-details/SubclaimRecovery'
import chroma from 'chroma-js'
import styled from '@emotion/styled'
import * as React from 'react'
import { useState } from 'react'
import { ClaimSubclaimFragment } from 'types/generated/graphql'
import { ValuationTableComponent } from '@hope/pages/tools/ValuationTablesPage'
import { useClaim } from '../../../hooks/use-claim'
import { useClaimItems } from '../../ClaimItems/useClaimItems'
import { useCommandLine } from '@hope/features/commands/hooks/use-command-line'
import { css } from '@emotion/react'
import { SubclaimReserve } from './SubclaimReserves/SubclaimReserve'
import { ClaimState, PaymentOrderState } from '@hope/features/config/constants'
import { ExclamationCircle } from 'react-bootstrap-icons'

const Section = styled.div<{ status?: 'warning' }>`
  width: 100%;
  background-color: ${({ theme }) =>
    chroma(theme.accent).brighten(1).alpha(0.1).hex()};

  ${({ theme, status }) =>
    status === 'warning' &&
    css`
      background-color: ${theme.lightWarning};
      color: ${theme.darkWarning};
    `}

  padding: 1.2rem;
  border-radius: 0.5rem;
`

const StyledLink = styled.a`
  display: block;
  padding-left: 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
`

const ClaimInfoTag = styled(InfoTag)`
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
`

const Subclaim: React.FC<{
  subclaim: ClaimSubclaimFragment
}> = ({ subclaim }) => {
  const { items, claimState, agreement } = useClaim()
  const { itemAge } = useClaimItems()
  const paymentOrders = subclaim?.paymentOrders
  const carrier = agreement?.carrier
  const [showValuationTable, setShowValuationTable] = useState(false)
  const { registerActions, isHintingOption } = useCommandLine()

  const hasReserve = !!subclaim.reserve.amount

  const hasNonSettledPaymentOrders =
    !!paymentOrders.length &&
    paymentOrders.some(
      ({ state }) =>
        ![PaymentOrderState.Settled, PaymentOrderState.Dismissed].includes(
          state as PaymentOrderState,
        ),
    )

  registerActions([
    {
      label: `Open terms and conditions`,
      keys: [Keys.Option, Keys.O],
      onResolve: () => {
        if (!agreement?.termsAndConditions?.url) return
        window.open(agreement.termsAndConditions.url, '_blank')
      },
    },
    {
      label: `Open valuation table`,
      keys: [Keys.Option, Keys.V],
      onResolve: () => {
        if (!agreement?.valuationTable) return
        setShowValuationTable((current) => !current)
      },
    },
  ])

  return (
    <Flex direction="column">
      <Flex gap="small">
        {!hasReserve && (
          <ClaimInfoTag status="warning">
            <Flex gap="small">
              <ExclamationCircle />
              <span>No reserve set</span>
            </Flex>
          </ClaimInfoTag>
        )}
        {hasNonSettledPaymentOrders && (
          <ClaimInfoTag status="info">
            <Flex gap="small">
              <ExclamationCircle />
              <span>There are non-settled payment orders</span>
            </Flex>
          </ClaimInfoTag>
        )}
      </Flex>
      <Flex direction="column" gap="medium">
        <Flex gap="small">
          <Section>
            <FourthLevelHeadline>Basic info</FourthLevelHeadline>
            <Spacing top="small" />
            <Label>Subclaim Id</Label>
            <Copyable iconValue={subclaim.id} />
            <Spacing top="small" />
            <div>
              <Spacing top="small" />
              {agreement ? (
                agreement.termsAndConditions?.url && (
                  <StyledLink
                    href={agreement.termsAndConditions.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms and Conditions{isHintingOption && <span> (O)</span>}
                  </StyledLink>
                )
              ) : (
                <div>⚠️ No agreement covers the claim on the date of loss</div>
              )}
              {agreement?.typeOfContract.includes('QASA') && (
                <div>
                  ⚠️ Make sure the member has claimed with their regular home
                  insurance
                </div>
              )}
              {agreement?.valuationTable && (
                <div>
                  <StyledLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowValuationTable(true)
                    }}
                  >
                    Valuation table{isHintingOption && <span> (V)</span>}
                  </StyledLink>
                  <Modal
                    visible={showValuationTable}
                    onClose={() => setShowValuationTable(false)}
                  >
                    <Spacing all>
                      <ValuationTableComponent
                        valuationTable={agreement.valuationTable}
                        highlights={items.map((item) => ({
                          itemAge: itemAge(item),
                          itemType: item.type,
                        }))}
                      />
                    </Spacing>
                  </Modal>
                </div>
              )}
            </div>
            <Spacing top="small" />
            <div>
              <Label>Type</Label>
              <SubclaimType subclaimId={subclaim.id} />
            </div>
          </Section>
          <Section>
            <FourthLevelHeadline>Outcome</FourthLevelHeadline>
            <Spacing top="small" />
            <div>
              <Label>Outcome</Label>
              <SubclaimOutcomeDropdown subclaimId={subclaim.id} />
            </div>
          </Section>
        </Flex>

        <Section>
          <FourthLevelHeadline>Claim cause</FourthLevelHeadline>
          <Spacing top="small" />
          <SubclaimCause subclaimId={subclaim.id} />
        </Section>

        <Flex direction="column" gap="medium">
          {carrier && <MainHeadline>{getCarrierText(carrier)}</MainHeadline>}
          <>
            <Section>
              {hasReserve || claimState === ClaimState.Closed ? (
                <CardTitle title={'Reserves'} />
              ) : (
                <Popover contents="This subclaim has no reserves">
                  <CardTitle title={'Reserves ⚠️'} />
                </Popover>
              )}
              <SubclaimReserve subclaimId={subclaim.id} />
            </Section>
            <Section>
              <SubclaimPaymentOrders subclaimId={subclaim.id} />
            </Section>
          </>
        </Flex>

        <Section>
          <SubclaimRecovery subclaimId={subclaim.id} />
        </Section>
      </Flex>
    </Flex>
  )
}

export default Subclaim
