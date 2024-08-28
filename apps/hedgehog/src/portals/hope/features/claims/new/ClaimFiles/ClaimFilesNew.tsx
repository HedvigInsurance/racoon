import {
  downloadFile,
  FileMimeTypeExtension,
  Modal,
  SwitchCard,
  useConfirmDialog,
} from '@hedvig-ui'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import {
  Button,
  Card,
  Div,
  Dropdown,
  Flex,
  Grid,
  Hr,
  LegacyTooltip,
  PopupMenu,
  PopupMenuItem,
} from '@hedvig-ui/redesign'
import { ClaimFileFragment } from 'types/generated/graphql'
import * as css from './ClaimFilesNew.css'
import { formatDate } from 'date-fns/format'
import { parseISO } from 'date-fns'
import { ComponentProps, useMemo, useState } from 'react'
import {
  BoxArrowUpRight,
  Check2,
  CloudArrowDown,
  File,
  FiletypeCsv,
  FiletypeDoc,
  FiletypeDocx,
  FiletypeM4p,
  FiletypeMp3,
  FiletypeMp4,
  FiletypePdf,
  FiletypePpt,
  FiletypePptx,
  FiletypeTxt,
  FiletypeWav,
  FiletypeXls,
  FiletypeXlsx,
  Folder,
  ThreeDotsVertical,
  Trash,
} from 'react-bootstrap-icons'
import { IconButton } from '@hedvig-ui/icons'
import { useClaimFile } from '@hope/features/claims/claim-details/ClaimFiles/hooks/use-claim-file'
import { theme } from '@hedvig-ui/redesign/theme'
import { FileUploadNew } from '@hope/features/claims/new/ClaimFiles/FileUploadNew'
import clsx from 'clsx'
import { getFileExtension } from '@hedvig-ui/utils/download'
import { PopupMenuLabel } from '@hedvig-ui/redesign/PopupMenu/PopupMenu'
import { CheckmarkIcon } from 'react-hot-toast'
import { extractPerformedBy } from '@hope/features/user/util'
import { cssUtil } from '@hedvig-ui/redesign/theme/cssUtil.css'

export const ClaimFilesNew = () => {
  const { claimId, memberId, files } = useClaim()
  const [excludeHandled, setExcludeHandled] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<ClaimFileFolder | 'all'>(
    'all',
  )
  const [fileTypeFilter, setFileTypeFilter] = useState(FileTypeFilter.All)
  const [sortDirective, setSortDirective] = useState(
    Object.keys(PossibleSortDirectives)[0],
  )

  const filteredAndSorted = useMemo(() => {
    let result = files
    if (excludeHandled) {
      result = result.filter((f) => f.handledBy == null)
    }
    if (selectedFolder !== 'all') {
      result = result.filter((f) => f.folder === selectedFolder)
    }
    result = result.filter((f) =>
      FileTypeFilterPredicate[fileTypeFilter](deduceContentType(f)),
    )
    if (sortDirective) {
      const directive = PossibleSortDirectives[sortDirective]
      const sortFlipper = directive.direction === 'desc' ? -1 : 1
      result = result.toSorted((a, b) => {
        const aVal = a[directive.property]
        const bVal = b[directive.property]
        return (aVal > bVal ? 1 : aVal === bVal ? 0 : -1) * sortFlipper
      })
    }
    return result
  }, [files, excludeHandled, selectedFolder, fileTypeFilter, sortDirective])

  const folderFilterOptions: ComponentProps<typeof Dropdown>['options'] =
    Object.entries(ClaimFileFolder).map(([name, folder]) => ({
      value: folder,
      label: name,
      selected: selectedFolder === folder,
      action: () => setSelectedFolder(folder),
    }))
  folderFilterOptions.unshift({
    value: 'all',
    label: 'All files',
    selected: selectedFolder === 'all',
    action: () => setSelectedFolder('all'),
  })

  const fileTypeFilterOptions: ComponentProps<typeof Dropdown>['options'] =
    Object.values(FileTypeFilter).map((filter) => ({
      value: filter,
      label: filter,
      selected: fileTypeFilter === filter,
      action: () => setFileTypeFilter(filter),
    }))

  const sortOrderOptions: ComponentProps<typeof Dropdown>['options'] =
    Object.keys(PossibleSortDirectives).map((value) => ({
      value: value,
      label: value,
      selected: value === sortDirective,
      action: () => setSortDirective(value),
    }))

  return (
    <Flex direction="column" gap={'medium'}>
      <Card>
        <Grid templateColumns="repeat(auto-fit, 270px)" gap={'medium'}>
          <SwitchCard
            label={'Exclude handled'}
            active={excludeHandled}
            onClick={() => setExcludeHandled((current) => !current)}
          />
          <Dropdown label="Folder" options={folderFilterOptions} />
          <Dropdown label="File type" options={fileTypeFilterOptions} />
          <Dropdown label="Sort by" options={sortOrderOptions} />
        </Grid>
      </Card>
      <Div className={css.fileCardContainer}>
        <FileUploadNew claimId={claimId} memberId={memberId} />
        {filteredAndSorted.map((file) => (
          <FileCard key={file.claimFileId} file={file} />
        ))}
      </Div>
    </Flex>
  )
}

enum FileTypeFilter {
  All = 'All',
  Images = 'Images',
  Documents = 'Documents',
  Videos = 'Videos',
}

const FileTypeFilterPredicate: Record<
  FileTypeFilter,
  (contentType: string) => boolean
> = {
  All: () => true,
  Images: (contentType) => contentType.includes('image'),
  Documents: (contentType) =>
    contentType.includes('document') ||
    contentType.includes('pdf') ||
    contentType.includes('msword') ||
    contentType.includes('ms-powerpoint') ||
    contentType.includes('ms-excel'),
  Videos: (contentType) => contentType.includes('video'),
}

enum ClaimFileFolder {
  Communication = 'COMMUNICATION',
  Claim = 'CASE',
  Receipts = 'OWNERSHIP_&_VALUE',
  'Cost proposals' = 'QUOTES_&_ESTIMATES',
  Other = 'OTHER',
}

function nameOfFolder(folder: string) {
  const [name] = Object.entries(ClaimFileFolder).find(
    ([, value]) => value === folder,
  )!
  return name
}

type SortDirective = {
  property: keyof ClaimFileFragment
  direction: 'asc' | 'desc'
}

const PossibleSortDirectives: Record<string, SortDirective> = {
  'Uploaded (newest first)': {
    property: 'uploadedAt',
    direction: 'desc',
  },
  'Uploaded (oldest first)': {
    property: 'uploadedAt',
    direction: 'asc',
  },
  Name: {
    property: 'displayName',
    direction: 'asc',
  },
  'Name (Reverse)': {
    property: 'displayName',
    direction: 'desc',
  },
}

function FileCard({ file }: { file: ClaimFileFragment }) {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <div className={css.fileCard}>
        <Flex direction="column">
          <div
            className={css.fileImageContainer}
            onClick={() => setModalVisible(true)}
          >
            <Thumbnail file={file} />
          </div>
          <FileCardFooter file={file} />
        </Flex>

        <div className={css.topRightOverlay}>
          {file.folder && (
            <div className={css.folderPill}>
              <Folder /> {nameOfFolder(file.folder)}
            </div>
          )}
          {file.handledBy && (
            <LegacyTooltip
              content={`Handled by ${extractPerformedBy(file.handledBy)}`}
            >
              <CheckmarkIcon />
            </LegacyTooltip>
          )}
        </div>
      </div>

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Flex direction="column">
          <div className={css.modalContent}>
            <ModalContent file={file} />
          </div>
          <Flex justify="space-between" align="center" p="sm">
            {file.displayName}
            <Button
              variant="ghost"
              onClick={() => window.open(file.url, '_blank')}
            >
              Open in new tab
              <BoxArrowUpRight />
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  )
}

function Thumbnail({ file }: { file: ClaimFileFragment }) {
  const contentType = deduceContentType(file)
  if (contentType.includes('image')) {
    return <img src={file.thumbnailUrl ?? file.url} alt={file.displayName} />
  }
  if (contentType.includes('video')) {
    return <video src={file.url} />
  }
  if (file.thumbnailUrl) {
    return (
      <img
        src={file.thumbnailUrl}
        alt={file.displayName}
        // PDFs thumbnails are nicer as top-adjusted
        style={{ objectPosition: 'top' }}
      />
    )
  }
  const fileExtension = deduceFileExtension(file)

  const fileIcon =
    fileExtension &&
    {
      csv: <FiletypeCsv />,
      doc: <FiletypeDoc />,
      docx: <FiletypeDocx />,
      m4p: <FiletypeM4p />,
      m4a: <FiletypeM4p />,
      mp3: <FiletypeMp3 />,
      mp4: <FiletypeMp4 />,
      pdf: <FiletypePdf />,
      ppt: <FiletypePpt />,
      pptx: <FiletypePptx />,
      txt: <FiletypeTxt />,
      wav: <FiletypeWav />,
      xls: <FiletypeXls />,
      xlsx: <FiletypeXlsx />,
    }[fileExtension]

  if (fileIcon) {
    return <div>{fileIcon}</div>
  }

  return (
    <div>
      <File />
      {fileExtension && (
        <span className={cssUtil.textMuted}>.{fileExtension}</span>
      )}
    </div>
  )
}

function ModalContent({ file }: { file: ClaimFileFragment }) {
  const contentType = deduceContentType(file)

  if (contentType.includes('image')) {
    return <img src={file.url} alt={file.displayName} />
  }
  if (file.contentType.includes('video')) {
    return <video controls={true} src={file.url} />
  }

  return <object data={file.url} type={contentType} />
}

function FileCardFooter({ file }: { file: ClaimFileFragment }) {
  const { member } = useClaim()
  const { updateFolder, toggleIsHandled, deleteFile, updateDisplayName } =
    useClaimFile(file)
  const [showMore, setShowMore] = useState(false)
  const { confirmWithValue } = useConfirmDialog()

  let uploadedBySuffix = ''
  switch (file.uploadedBy?.__typename) {
    case 'AdminSystemUser':
    case 'EmailSystemUser':
      uploadedBySuffix = `by IEX`
      break
    case 'MemberSystemUser':
      uploadedBySuffix = `by ${member.firstName}`
      break
  }

  return (
    <Flex p="md" justify="space-between">
      <Flex direction="column" gap="xs">
        <LegacyTooltip content="Change filename">
          <span
            className={cssUtil.pointer}
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
            {file.displayName}
          </span>
        </LegacyTooltip>

        <span className={clsx(cssUtil.textMuted, cssUtil.textSmaller)}>
          Uploaded {formatDate(parseISO(file.uploadedAt), 'y-MM-dd')}{' '}
          {uploadedBySuffix}
        </span>
      </Flex>
      <PopupMenu
        visible={showMore}
        onClose={() => setShowMore(false)}
        target={
          <LegacyTooltip content="More">
            <IconButton onClick={() => setShowMore((prev) => !prev)}>
              <ThreeDotsVertical />
            </IconButton>
          </LegacyTooltip>
        }
      >
        <PopupMenuLabel>Folder</PopupMenuLabel>
        {Object.entries(ClaimFileFolder).map(([name, folder]) => (
          <PopupMenuItem key={folder} onClick={() => updateFolder(folder)}>
            {name}
            {folder === file.folder && <Check2 />}
          </PopupMenuItem>
        ))}

        <Hr
          style={{ marginTop: theme.space.xxs, marginBottom: theme.space.xxs }}
        />
        <PopupMenuLabel>Options</PopupMenuLabel>

        <PopupMenuItem onClick={toggleIsHandled}>
          {file.handledBy ? (
            <>
              Handled <Check2 />
            </>
          ) : (
            <>Mark as handled</>
          )}
        </PopupMenuItem>

        <PopupMenuItem
          onClick={async () => {
            await downloadFile({
              displayName: file.displayName,
              url: file.url,
              mimeType: file.contentType,
            })
          }}
        >
          Download file <CloudArrowDown />
        </PopupMenuItem>

        <PopupMenuItem onClick={() => window.open(file.url, '_blank')}>
          Open in new tab <BoxArrowUpRight />
        </PopupMenuItem>
        <PopupMenuItem
          style={{ color: theme.colors.signalRedElement }}
          onClick={deleteFile}
        >
          <span>Delete file</span>
          <Trash />
        </PopupMenuItem>
      </PopupMenu>
    </Flex>
  )
}

function deduceContentType(file: ClaimFileFragment): string {
  const contentTypeIsKnown = !!FileMimeTypeExtension[file.contentType]
  if (contentTypeIsKnown) {
    return file.contentType
  }
  const extension = getFileExtension(file.fileName)
  const deducedContentType = Object.entries(FileMimeTypeExtension).find(
    ([, ext]) => ext === extension,
  )?.[0]

  if (deducedContentType) {
    return deducedContentType
  }

  return file.contentType
}

function deduceFileExtension(file: ClaimFileFragment): string | undefined {
  const originalExtension = getFileExtension(file.fileName)

  function isKnown(
    extension?: string,
  ): extension is (typeof FileMimeTypeExtension)[number] {
    if (!extension) {
      return false
    }

    return Object.values(FileMimeTypeExtension).includes(extension)
  }

  if (isKnown(originalExtension)) {
    return originalExtension
  }

  const deducedExtension = FileMimeTypeExtension[file.contentType]

  if (deducedExtension) {
    return deducedExtension
  }

  return originalExtension
}
