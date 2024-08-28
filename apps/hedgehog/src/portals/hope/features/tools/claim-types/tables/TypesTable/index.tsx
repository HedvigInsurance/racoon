import styled from '@emotion/styled'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui'
import * as React from 'react'
import {
  useGetClaimTypeBindingsQuery,
  useGetClaimTypesQuery,
} from 'types/generated/graphql'
import { InsuranceType } from '../../../../config/constants'
import { BindingForm, TypeColumn } from './BindingForm'

const Container = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  padding-left: 18rem;

  &::-webkit-scrollbar {
    height: 0.5rem;
  }
`

const headColStyles = `
  width: 18rem;
  position: fixed;
  left: 0;
  z-index: 1;
`

const TypeHeadColumn = styled(TypeColumn)<{ last?: boolean }>`
  ${headColStyles}
  border-top: 1px solid ${({ theme }) => theme.accentContrast} !important;
  height: 6.45rem;
`

const TypeHeaderColumn = styled(TableHeaderColumn)<{ headCol?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.accentContrast} !important;
  min-width: 13rem;

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.accentContrast} !important;
  }

  ${({ headCol }) =>
    headCol &&
    `
    ${headColStyles}
    &:not(:first-of-type) {
      height: 5rem;
      display: flex;
      align-items: center;
    }
  `}
`

export const TypesTable: React.FC<{ filter: string }> = ({ filter }) => {
  const { data: typesData } = useGetClaimTypesQuery()
  const { data: bindingsData } = useGetClaimTypeBindingsQuery()

  const claimTypes = typesData?.claimTypes
  const typesBindings = bindingsData?.claimTypeBindings

  if (!claimTypes || !typesBindings) {
    return null
  }

  const claimFilteredTypes = claimTypes
    .filter((type) =>
      filter ? type.toLowerCase().includes(filter.toLowerCase()) : true,
    )
    .sort((a, b) => a.localeCompare(b))

  return (
    <Container>
      <Table>
        <TableHeader>
          <TypeHeaderColumn headCol>Type/Insurance</TypeHeaderColumn>
          {Object.values(InsuranceType).map((contract) => (
            <TypeHeaderColumn key={contract}>
              {convertEnumToTitle(contract)}
            </TypeHeaderColumn>
          ))}
        </TableHeader>

        <TableBody>
          {claimFilteredTypes.map((type, index) => (
            <TableRow key={type}>
              <TypeHeadColumn last={index === claimFilteredTypes.length - 1}>
                {convertEnumToTitle(type)}
              </TypeHeadColumn>
              {Object.values(InsuranceType).map((insurance) => {
                const binding = typesBindings.find(
                  (binding) =>
                    binding?.claimType === type &&
                    binding.insuranceType === insurance,
                )

                return (
                  <BindingForm
                    key={insurance}
                    binding={binding}
                    insuranceType={insurance}
                    claimType={type}
                  />
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}
