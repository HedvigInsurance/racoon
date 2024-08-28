import { Button, ExcelInput, FileUploadTableStatusType, Flex } from '@hedvig-ui'
import gql from 'graphql-tag'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { toast } from 'react-hot-toast'
import {
  UpsertGsrCaseOfficerInput,
  useUpsertGsrCaseOfficersMutation,
} from 'types/generated/graphql'

gql`
  mutation UpsertGsrCaseOfficers($input: [UpsertGsrCaseOfficerInput!]!) {
    gsr_upsertCaseOfficers(input: $input)
  }
`

export const GsrCaseOfficersUpload: React.FC = () => {
  const [upsertGsrCaseOfficers] = useUpsertGsrCaseOfficersMutation()
  const [gsrCaseOfficers, setGsrCaseOfficers] = useState<
    UpsertGsrCaseOfficerInput[] | null
  >(null)
  const [carrier, setCarrier] = useState<string | null>(null)

  const [fileData, setFileData] = useState<string[][]>([])
  const [fileRowStatus, setFileRowStatus] = useState<FileUploadTableStatusType>(
    {},
  )

  useEffect(() => {
    setGsrCaseOfficers(() => {
      console.table(fileData)
      return fileData
        .slice(2)
        .filter(
          (row, rowIndex) =>
            !row.some((cell) => {
              if (cell.includes('REST API')) {
                setFileRowStatus((prev) => ({
                  ...prev,
                  [rowIndex]: {
                    message: 'Will not be uploaded',
                    status: 'error',
                  },
                }))
                return true
              }
              return false
            }),
        )
        .map((cells) => {
          const caseOfficerId = cells[1]
          const carrierCell = cells[3]
          const carrier = carrierCell.includes('EIR')
            ? 'EIR'
            : carrierCell.includes('HDI')
              ? 'HDI'
              : 'HEDVIG'
          setCarrier(carrier)
          const email = cells[6]
          return {
            caseOfficerId,
            carrier,
            email,
          } as UpsertGsrCaseOfficerInput
        })
    })
  }, [fileData])

  return (
    <Flex direction="column" gap="small" style={{ paddingBottom: '4rem' }}>
      <ExcelInput
        startRow={1}
        data={fileData}
        setData={setFileData}
        fileNameRequirement="Användare - GSR"
        tableStatus={fileRowStatus}
      >
        Select Excel "Användare - GSR.xlsx"
      </ExcelInput>
      {gsrCaseOfficers && carrier && (
        <Button
          variant="secondary"
          onClick={() =>
            toast.promise(
              upsertGsrCaseOfficers({
                variables: {
                  input: gsrCaseOfficers,
                },
              }),
              {
                loading: 'Updating GSR case officers...',
                success: () => {
                  setGsrCaseOfficers(null)
                  return 'Success!'
                },
                error: 'Something went wrong...',
              },
            )
          }
        >
          Upload {gsrCaseOfficers.length} GSR case officers of {carrier}
        </Button>
      )}
    </Flex>
  )
}
