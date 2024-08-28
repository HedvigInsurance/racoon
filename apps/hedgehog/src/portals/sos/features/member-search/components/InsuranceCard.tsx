import styled from '@emotion/styled'
import * as React from 'react'
import { Flex, Spacing } from '@hedvig-ui'
import chroma from 'chroma-js'
import { convertEnumToTitle } from '@hedvig-ui'
import { SimpleMemberLookupContract } from 'types/generated/graphql'

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 1.5rem;
  border-radius: 0.75rem;
  width: 25rem;

  border: 1px solid ${({ theme }) => theme.foreground};

  #insurance-name {
    font-size: 1.3rem;
  }

  #insurance-status {
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.accentContrast};
    background-color: ${({ theme }) =>
      chroma(theme.success).brighten(0.5).hex()};
  }

  #insurance-date {
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.foreground).brighten(1).hex()};
  }

  #insurance-coinsured {
    padding-top: 1rem;
    font-size: 1rem;
    color: ${({ theme }) => chroma(theme.foreground).brighten(1).hex()};
  }

  #insurance-address {
    div {
      span {
        display: inline-block;
        margin: 0 0.25rem;
        color: ${({ theme }) => chroma(theme.foreground).brighten(4).hex()};
      }
      border-radius: 0.25rem;
      padding: 0.3rem 0.6rem;
      font-size: 1rem;
      background-color: ${({ theme }) =>
        chroma(theme.foreground).brighten(1).alpha(0.1).hex()};
    }
  }
`

export const InsuranceCard: React.FC<{
  contract: SimpleMemberLookupContract
}> = ({
  contract: {
    insuranceType,
    masterInception,
    terminationDate,
    numberCoInsured,
    address,
  },
}) => {
  return (
    <Card>
      <Flex justify="space-between" align="center">
        <div id="insurance-name">{convertEnumToTitle(insuranceType)}</div>
      </Flex>
      <Flex>
        <div id="insurance-date">
          {masterInception} - {terminationDate ?? 'Ongoing'}
        </div>
      </Flex>
      <Flex>
        <div id="insurance-coinsured">
          Covers holder {numberCoInsured > 0 ? '+ ' + numberCoInsured : ''}
        </div>
      </Flex>
      {address && (
        <>
          <Spacing top="small" />
          <Flex>
            <div id="insurance-address">
              <div>
                {address.street} <span>•</span> {address.postalCode}{' '}
                {!!address?.city && (
                  <>
                    <span>•</span> {address.city}
                  </>
                )}
              </div>
            </div>
          </Flex>
        </>
      )}
    </Card>
  )
}
