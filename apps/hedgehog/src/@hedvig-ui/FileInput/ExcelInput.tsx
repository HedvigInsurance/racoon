'use client'

import { ReactNode, useRef } from 'react'
import { Button, TableHeader, TableHeaderColumn, TableRow } from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import { read, utils } from 'xlsx'
import styled from '@emotion/styled'

const Td = styled.td`
  padding: 0.25rem 0.5rem !important;
`
const RowStatus = styled(Td)<{ status: 'success' | 'error' }>`
  background-color: transparent !important;
  border: none !important;
  position: absolute !important;
  left: 100% !important;
  width: max-content !important;
  color: ${({ theme, status }) =>
    status === 'success' ? theme.success : theme.danger} !important;
`

export type FileUploadTableStatusType = Record<
  number,
  {
    status: 'error' | 'success'
    message: string
  }
>

const FileExtensions = {
  Excel: 'xlsx',
  CSV: 'csv',
}

export const ExcelInput = ({
  startRow,
  data,
  setData,
  fileNameRequirement,
  tableStatus,
  children,
}: {
  startRow?: number
  data: string[][]
  setData: (data: string[][]) => void
  fileNameRequirement?: string
  tableStatus?: FileUploadTableStatusType
  children: ReactNode
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const acceptedExtensions = [FileExtensions.Excel, FileExtensions.CSV]

  const handleFileUpload = (files: FileList | null) => {
    if (!files?.length) {
      return
    }
    if (files.length !== 1) {
      toast.error(`Invalid file length ${files.length}`)
      return
    }
    const file = files[0]
    if (fileNameRequirement && !file.name.includes(fileNameRequirement)) {
      toast.error(`Invalid file name ${file.name}`)
      return
    }
    const fileExtension = file.name.split('.')[1]
    if (!acceptedExtensions.includes(fileExtension)) {
      toast.error(`Invalid file type ${file.name}`)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const binaryString = event.target?.result?.toString()
      if (!binaryString) {
        return
      }
      if (fileExtension === FileExtensions.CSV) {
        const readData = binaryString.split('\n').map((row) => row.split(','))
        return setData(readData)
      }

      const workBook = read(binaryString, { type: 'binary' })
      const worksheetName = workBook.SheetNames[0]
      const worksheet = workBook.Sheets[worksheetName]
      const data = utils.sheet_to_csv(worksheet)
      const readData = data.split('\n').map((row) => row.split(','))
      return setData(readData)
    }
    reader.readAsBinaryString(file)
  }

  return (
    <>
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        accept={acceptedExtensions.map((ext) => `.${ext}`).join(',')}
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      <Button status="success" onClick={() => inputRef.current?.click()}>
        {children}
      </Button>
      {!!data.length && (
        <table>
          <TableHeader>
            <TableHeaderColumn>Row number</TableHeaderColumn>
            {data[startRow ?? 0].map((column) => (
              <TableHeaderColumn key={column}>{column}</TableHeaderColumn>
            ))}
          </TableHeader>
          <tbody>
            {[...data]
              .slice(startRow ? startRow + 1 : 1)
              .map((model, rowIndex) => (
                <TableRow key={`${rowIndex}`} style={{ position: 'relative' }}>
                  <Td>{rowIndex + 1}</Td>
                  {model.map((property, columnIndex) => (
                    <Td key={`row - ${rowIndex} - col - ${columnIndex}`}>
                      {property}
                    </Td>
                  ))}
                  {!!tableStatus?.[rowIndex] && (
                    <RowStatus status={tableStatus[rowIndex].status}>
                      {tableStatus[rowIndex].message}
                    </RowStatus>
                  )}
                </TableRow>
              ))}
          </tbody>
        </table>
      )}
    </>
  )
}
