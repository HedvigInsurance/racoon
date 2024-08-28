import styled from '@emotion/styled'
import {
  dateTimeFormatter,
  LoadingMessage,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import * as React from 'react'
import { FileUpload, useFileUploadsQueryQuery } from 'types/generated/graphql'

const Image = styled.img`
  width: 300px;
`

const MemberFileTable: React.FC<{
  memberFiles: FileUpload[]
}> = ({ memberFiles }) => (
  <Table>
    <TableHeader>
      <TableHeaderColumn>Member File</TableHeaderColumn>
      <TableHeaderColumn>Time Stamp</TableHeaderColumn>
      <TableHeaderColumn>File Type</TableHeaderColumn>
    </TableHeader>
    <TableBody>
      {[...memberFiles]
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )
        .map((memberFile) => (
          <TableRow
            border
            onClick={() => window.open(memberFile.fileUploadUrl!)}
            key={memberFile.fileUploadUrl}
          >
            <TableColumn>
              {memberFile.mimeType?.toLowerCase()?.includes('image') ? (
                <Image src={memberFile.fileUploadUrl!} />
              ) : (
                <a href={memberFile.fileUploadUrl!} target="_blank">
                  Open file
                </a>
              )}
            </TableColumn>
            <TableColumn>
              {dateTimeFormatter(memberFile.timestamp, 'yyyy-MM-dd HH:mm:ss')}
            </TableColumn>
            <TableColumn>{memberFile.mimeType}</TableColumn>
          </TableRow>
        ))}
    </TableBody>
  </Table>
)

export const MemberFilesTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data, loading, error } = useFileUploadsQueryQuery({
    variables: { memberId },
    fetchPolicy: 'no-cache',
  })

  if (error) {
    return (
      <div>
        Error in GraphQl query here.....:{' '}
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }
  if (loading || !data?.member) {
    return <LoadingMessage paddingTop="10vh" />
  }

  return data.member?.fileUploads.length === 0 ? (
    <StandaloneMessage paddingTop="10vh">
      No files uploaded for this member
    </StandaloneMessage>
  ) : (
    <MemberFileTable memberFiles={data.member.fileUploads} />
  )
}
