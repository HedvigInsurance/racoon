import styled from '@emotion/styled'
import {
  Button,
  CardContent,
  CardTitle,
  Checkbox,
  convertEnumToTitle,
  Flex,
  getBlobFromUrl,
  getFilename,
  Popover,
  sleep,
  Spacing,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  useConfirmDialog,
  useLocalStorage,
} from '@hedvig-ui'
import * as React from 'react'
import { useMemo, useState } from 'react'
import { BugFill, Download, Folder as FolderIcon } from 'react-bootstrap-icons'
import { ClaimFileFragment } from 'types/generated/graphql'
import { FileRow } from './FileRow'
import { FileUpload } from './FileUpload'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

const TableWithOverflow = styled(Table)`
  overflow: visible !important;
`

const NoClaimFiles = styled.div`
  padding: 1rem;
`

const SortableTableHeaderColumn = styled(TableHeaderColumn)<{
  selected: boolean
}>`
  ${({ selected }) => (selected ? `font-weight: 600;` : '')}
  cursor: pointer;
`

const FolderWrapper = styled.div<{ selected: boolean; empty: boolean }>`
  ${({ empty }) => (empty ? 'cursor: not-allowed;' : 'cursor: pointer;')}
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 1rem;
  display: flex;
  justify-items: center;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ empty, theme }) =>
    empty ? theme.mutedBackground : theme.background};
  border-color: ${({ empty, selected, theme }) =>
    selected
      ? theme.borderStrong
      : empty
        ? theme.backgroundTransparentContrast
        : ''};
  ${({ empty, theme }) => (empty ? `color: ${theme.mutedText}` : '')};
`

const Folder: React.FC<{
  selected: boolean
  size: number
  onClick: () => void
  folder: ClaimFileFolder
}> = ({ selected, size, onClick, folder }) => {
  return (
    <FolderWrapper
      onClick={!size ? undefined : onClick}
      selected={selected}
      empty={!size}
    >
      <FolderIcon />
      {convertEnumToTitle(folder)} ({size})
    </FolderWrapper>
  )
}

export enum ClaimFileFolder {
  Case = 'CASE',
  OwnershipAndValue = 'OWNERSHIP_&_VALUE',
  QuotesAndEstimates = 'QUOTES_&_ESTIMATES',
  Communication = 'COMMUNICATION',
  Other = 'OTHER',
}

export const ClaimFileFolderDescription: Record<ClaimFileFolder, string> = {
  [ClaimFileFolder.Case]:
    'Documents for strengthening claim case (inspections, police reports, photos, etc.)',
  [ClaimFileFolder.OwnershipAndValue]:
    'Documents for ownership and valuation (receipts, appraisals, photos, etc.)',
  [ClaimFileFolder.QuotesAndEstimates]:
    'Quotations, estimates, and cost proposals',
  [ClaimFileFolder.Communication]:
    'Emails and communication with involved parties (FT, MP, etc.)',
  [ClaimFileFolder.Other]:
    'Other miscellaneous items and images that do not fit in other folders',
}

export const ClaimFileTable: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { memberId, claimNumber, files, refetch, error } = useClaim()
  const [showContent, setShowContent] = useState(false)
  const [folder, setFolder] = useState<null | ClaimFileFolder>(null)
  const [filterHandled, setFilterHandled] = useState(false)
  const [sortColumn, setSortColumn] = useLocalStorage<
    'uploadedAt' | 'filename'
  >('hvg:claim-file-sort-column', 'uploadedAt')
  const [sortDirection, setSortDirection] = useLocalStorage<number>(
    'hvg:claim-file-sort-direction',
    1,
  )
  const { confirm } = useConfirmDialog()

  const sort = useMemo(() => {
    return sortColumn === 'uploadedAt'
      ? (a: ClaimFileFragment, b: ClaimFileFragment) => {
          const aDate = new Date(a.uploadedAt)
          const bDate = new Date(b.uploadedAt)

          return bDate.getTime() - aDate.getTime()
        }
      : sortColumn === 'filename'
        ? (a: ClaimFileFragment, b: ClaimFileFragment) =>
            a.displayName < b.displayName ? -1 : 1
        : () => 1
  }, [sortColumn])

  const currentFiles = useMemo(
    () =>
      files
        .filter((file) => !folder || file.folder === folder)
        .filter((file) => !filterHandled || !file.handledBy)
        .slice()
        .sort((a, b) => sort(a, b) * sortDirection),
    [folder, filterHandled, files, sort, sortDirection],
  )

  return (
    <CardContent>
      <CardTitle
        title="Files"
        badge={
          error
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      {!!memberId && (
        <FileUpload
          claimId={claimId}
          memberId={memberId}
          onUpload={async () => {
            await sleep(500)
            await refetch()
          }}
        />
      )}
      {files.length !== 0 && (
        <div>
          <Spacing all>
            <Flex gap="small" justify="center" wrap="wrap">
              {Object.values(ClaimFileFolder).map((claimFolder) => (
                <Popover
                  key={claimFolder}
                  contents={ClaimFileFolderDescription[claimFolder]}
                >
                  <Folder
                    selected={folder === claimFolder}
                    size={
                      files.filter((file) => file.folder === claimFolder).length
                    }
                    onClick={() =>
                      claimFolder === folder
                        ? setFolder(null)
                        : setFolder(claimFolder)
                    }
                    folder={claimFolder}
                  />
                </Popover>
              ))}
            </Flex>
          </Spacing>
          <TableWithOverflow>
            <TableHeader>
              <SortableTableHeaderColumn
                selected={sortColumn === 'filename'}
                onClick={() => {
                  if (sortColumn === 'filename') {
                    setSortDirection((current) => current * -1)
                  } else {
                    setSortColumn('filename')
                  }
                }}
              >
                File {sortDirection === 1 ? '↑' : '↓'}
              </SortableTableHeaderColumn>
              <TableHeaderColumn>Note</TableHeaderColumn>
              <TableHeaderColumn>
                <Flex>
                  <Popover contents="Pre-download images/pdfs">
                    <Checkbox
                      checked={showContent}
                      onChange={() => setShowContent((current) => !current)}
                    />
                  </Popover>
                  <span>Pre-download</span>
                </Flex>
              </TableHeaderColumn>
              <TableHeaderColumn>
                <Flex gap="tiny">
                  Handled
                  <Popover
                    contents={
                      filterHandled ? 'Handled excluded' : 'Exclude handled?'
                    }
                  >
                    <Checkbox
                      checked={filterHandled}
                      onChange={() => setFilterHandled((current) => !current)}
                    />
                  </Popover>
                </Flex>
              </TableHeaderColumn>
              <SortableTableHeaderColumn
                selected={sortColumn === 'uploadedAt'}
                onClick={() => {
                  if (sortColumn === 'uploadedAt') {
                    setSortDirection((current) => current * -1)
                  } else {
                    setSortColumn('uploadedAt')
                  }
                }}
              >
                Uploaded {sortDirection === 1 ? '↑' : '↓'}
              </SortableTableHeaderColumn>
              <TableHeaderColumn>Folder</TableHeaderColumn>
              <TableHeaderColumn>
                <Popover
                  contents={
                    !folder
                      ? 'Click to download all files'
                      : `Click to download "${convertEnumToTitle(
                          folder,
                        )}" folder`
                  }
                >
                  <Button
                    disabled={currentFiles.length === 0}
                    style={{ marginLeft: '1.5rem' }}
                    variant="tertiary"
                    onClick={async () => {
                      await confirm(
                        `Are you sure you want to download all files${
                          folder
                            ? ` in the "${convertEnumToTitle(folder)}" folder`
                            : ''
                        }?\n\n${currentFiles
                          .map(
                            (file, index) =>
                              `${index + 1}: ${getFilename(
                                file.displayName,
                                file.contentType,
                              )}`,
                          )
                          .join('\n')}`,
                      )
                      const downloads = await toast.promise(
                        Promise.all(
                          currentFiles.map((file, index) =>
                            getBlobFromUrl({
                              displayName: `${index + 1}: ${file.displayName}`,
                              url: file.url,
                              mimeType: file.contentType,
                            }),
                          ),
                        ),
                        {
                          success: 'Downloaded',
                          loading: 'Downloading...',
                          error: 'Something went wrong',
                        },
                      )
                      const zip = new JSZip()
                      downloads.forEach((download) => {
                        zip.file(download.filename, download.blob)
                      })
                      const zipBlob = await zip.generateAsync({
                        type: 'blob',
                      })
                      saveAs(
                        zipBlob,
                        `member-${memberId} claim-${claimNumber}${
                          folder
                            ? ` folder-(${convertEnumToTitle(folder)})`
                            : ''
                        }.zip`,
                      )
                    }}
                  >
                    <Flex align="center" gap="tiny">
                      Zip <Download />
                    </Flex>
                  </Button>
                </Popover>
              </TableHeaderColumn>
            </TableHeader>
            <TableBody>
              {!files ? (
                <TableRow>
                  <TableColumn>
                    <NoClaimFiles>
                      No claim documents have been uploaded for this claim
                    </NoClaimFiles>
                  </TableColumn>
                </TableRow>
              ) : (
                currentFiles.map((file) => (
                  <FileRow
                    key={file.claimFileId}
                    claimId={claimId}
                    file={file}
                    refetch={() => refetch()}
                    showContent={showContent}
                  />
                ))
              )}
            </TableBody>
          </TableWithOverflow>
        </div>
      )}
    </CardContent>
  )
}
