import {
  Button,
  Checkbox,
  convertEnumToTitle,
  dateTimeFormatter,
  downloadFile,
  Dropdown,
  DropdownOption,
  FileMimeTypeExtension,
  Flex,
  getFilename,
  Modal,
  Popover,
  sleep,
  TableColumn,
  TableRow,
  useConfirmDialog,
} from '@hedvig-ui'
import * as React from 'react'
import { useState } from 'react'
import { ClaimFileFragment } from 'types/generated/graphql'
import { DeleteButton } from './DeleteClaimFileButton'
import { App, AppIndicator, Download } from 'react-bootstrap-icons'
import { useClaimFile } from '@hope/features/claims/claim-details/ClaimFiles/hooks/use-claim-file'
import { ClaimFileFolder } from '@hope/features/claims/claim-details/ClaimFiles/index'
import styled from '@emotion/styled'

const UploadTimestamp = styled.span<{ isMember: boolean }>`
  color: ${({ isMember, theme }) =>
    isMember ? theme.success : theme.foreground};
  font-size: 0.85rem;
`

export const FileRow: React.FC<{
  claimId: string
  file: ClaimFileFragment
  refetch: () => void
  showContent: boolean
}> = ({ claimId, file, refetch, showContent }) => {
  const { confirmWithValue } = useConfirmDialog()
  const { updateDisplayName, toggleIsHandled, updateNote, updateFolder } =
    useClaimFile(file)
  const [showPreview, setShowPreview] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  return (
    <TableRow>
      <TableColumn
        onClick={async () => {
          confirmWithValue({
            content: 'Change filename:',
            values: {
              displayName: {
                type: 'input',
                label: 'Filename',
              },
            },
            defaultValues: {
              displayName: file.displayName ?? '',
            },
          }).then((data) => {
            updateDisplayName(data?.displayName as string)
          })
        }}
      >
        <Popover contents="Change filename">{file.displayName}</Popover>
      </TableColumn>
      <TableColumn>
        <div
          onClick={() => {
            confirmWithValue({
              content: 'Set note',
              values: {
                note: {
                  type: 'textarea',
                  label: 'Note',
                },
              },
              defaultValues: {
                note: file.note ?? '',
              },
            }).then((data) => {
              updateNote(data?.note as string)
            })
          }}
        >
          <Popover contents={file.note ? file.note : 'Click to set note'}>
            {file.note ? <AppIndicator /> : <App />}
          </Popover>
        </div>
      </TableColumn>
      <TableColumn>
        <Flex justify="center" align="center">
          {file.contentType?.toLowerCase()?.includes('image') ? (
            <Popover
              contents={
                !showContent && <img style={{ width: '100%' }} src={file.url} />
              }
            >
              <Button onClick={() => setShowPreview(true)}>
                {showContent ? (
                  <img style={{ width: '100%' }} src={file.url} />
                ) : (
                  `.${FileMimeTypeExtension[file.contentType] ?? 'UNKNOWN'}`
                )}
              </Button>
            </Popover>
          ) : file.contentType?.toLowerCase()?.includes('pdf') ? (
            <Popover
              contents={
                !showContent && (
                  <object style={{ width: '100%' }} data={file.url} />
                )
              }
            >
              <Button onClick={() => setShowPreview(true)}>
                {showContent ? (
                  <object style={{ width: '100%' }} data={file.url} />
                ) : (
                  `.${FileMimeTypeExtension[file.contentType] ?? 'UNKNOWN'}`
                )}
              </Button>
            </Popover>
          ) : (
            <a href={file.url} target="_blank">
              .{FileMimeTypeExtension[file.contentType] ?? 'UNKNOWN'}
            </a>
          )}
        </Flex>
      </TableColumn>
      <TableColumn>
        <Popover
          contents={
            file.handledBy ? `Handled by ${file.handledBy.name}` : 'Handled?'
          }
        >
          <Checkbox
            style={{ marginLeft: '0.75rem' }}
            checked={!!file.handledBy}
            onChange={toggleIsHandled}
          />
        </Popover>
      </TableColumn>
      <TableColumn>
        <Popover
          contents={`Uploaded by ${
            !file.uploadedBy
              ? '(unknown)'
              : file.uploadedBy.__typename === 'AdminSystemUser'
                ? file.uploadedBy.name
                : 'member'
          }`}
        >
          <UploadTimestamp
            isMember={file?.uploadedBy?.__typename === 'MemberSystemUser'}
          >
            {dateTimeFormatter(file.uploadedAt, 'yyyy-MM-dd HH:mm:ss')}
          </UploadTimestamp>
        </Popover>
      </TableColumn>
      <TableColumn>
        <Dropdown placeholder="None selected" position="top">
          {Object.values(ClaimFileFolder).map((folder) => (
            <DropdownOption
              key={folder}
              onClick={() => updateFolder(folder)}
              selected={file.folder === folder}
            >
              {convertEnumToTitle(folder)}
            </DropdownOption>
          ))}
        </Dropdown>
      </TableColumn>
      <TableColumn>
        <Flex gap="tiny">
          <Popover
            contents={`Click to download\n"${getFilename(
              file.displayName,
              file.contentType,
            )}"`}
          >
            <Button
              variant={downloaded ? 'tertiary' : 'primary'}
              icon={<Download />}
              onClick={async () => {
                await downloadFile({
                  displayName: file.displayName,
                  url: file.url,
                  mimeType: file.contentType,
                })
                setDownloaded(true)
              }}
            />
          </Popover>
          <Popover contents="Click to delete">
            <DeleteButton
              claimId={claimId}
              claimFileId={file.claimFileId}
              onDeleted={async () => {
                await sleep(500)
                await refetch()
              }}
            />
          </Popover>
        </Flex>
      </TableColumn>

      <Modal visible={showPreview} onClose={() => setShowPreview(false)}>
        {file.contentType.includes('pdf') ? (
          <object style={{ width: '100ch', height: '90vh' }} data={file.url} />
        ) : (
          <img style={{ width: '100%' }} src={file.url} />
        )}
      </Modal>
    </TableRow>
  )
}
