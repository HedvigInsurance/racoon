import {
  Capitalized,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { MemberStatusBadge } from '@hope/features/member/tabs/campaigns-tab/styles'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { MemberReferral } from 'types/generated/graphql'

export const MembersReferredTable: React.FC<{
  members: MemberReferral[]
}> = ({ members }) => {
  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Member id</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableHeader>

      {members.map((member) => (
        <TableRow key={member.memberId + member.status} border>
          <TableColumn>
            <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
          </TableColumn>
          <TableColumn>{member.name}</TableColumn>
          <TableColumn>
            <MemberStatusBadge status={member.status}>
              <Capitalized>{member.status}</Capitalized>
            </MemberStatusBadge>
          </TableColumn>
        </TableRow>
      ))}
    </Table>
  )
}
