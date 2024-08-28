import { useEffect, useState } from 'react'
import {
  Button,
  ExcelInput,
  extractErrorMessage,
  FileUploadTableStatusType,
  Spinner,
} from '@hedvig-ui'
import {
  UpsertPaymentOrderInput,
  useCreatePaymentOrderMutation,
} from 'types/generated/graphql'
import { format } from 'date-fns'
import styled from '@emotion/styled'

const Wrapper = styled.div`
  padding: 2rem;
`

const BatchUploadPaymentOrdersPage = () => {
  const [fileData, setFileData] = useState<string[][]>([])
  const [uploadOrderStatus, setUploadOrderStatus] =
    useState<FileUploadTableStatusType>({})
  const [paymentOrders, setPaymentOrders] = useState<
    { subclaimId: string; paymentOrder: UpsertPaymentOrderInput }[]
  >([])
  const [createPaymentOrder, { loading }] = useCreatePaymentOrderMutation()

  useEffect(() => {
    setPaymentOrders(
      fileData.slice(1).map((cells) => {
        return {
          subclaimId: cells[0],
          paymentOrder: {
            type: cells[1],
            carrier: cells[2],
            costType: cells[3],
            method: cells[4],
            number: cells[5],
            bankName: cells[6],
            bic: cells[7],
            amount: {
              amount: parseFloat(cells[8]),
              currency: cells[10],
            },
            deductible: {
              amount: parseFloat(cells[9]),
              currency: cells[10],
            },
            isExGratia: cells[11] ? cells[11].toLowerCase() === 'true' : false,
            sanctionListSkipped: cells[12]
              ? cells[12].toLowerCase() === 'true'
              : false,
            note: cells[13],
            recipientType: cells[14],
            recipientName: cells[15],
            reference: cells[16],
            readyInBank: cells[17] ? cells[17].toLowerCase() === 'true' : false,
            dueDate: cells[18]
              ? format(new Date(cells[18]), 'yyyy-MM-dd')
              : null,
            costCategory: cells[19] ? cells[19] : null,
          },
        }
      }),
    )
  }, [fileData])

  const addModelsInBatch = () => {
    paymentOrders.forEach(async ({ subclaimId, paymentOrder }, index) =>
      createPaymentOrder({
        variables: { subclaimId, paymentOrder },
      })
        .then(() => {
          setUploadOrderStatus((prev) => ({
            ...prev,
            [index]: { status: 'success', message: 'Added' },
          }))
        })
        .catch(({ message }) => {
          setUploadOrderStatus((prev) => ({
            ...prev,
            [index]: { status: 'error', message: extractErrorMessage(message) },
          }))
        }),
    )
  }

  return (
    <Wrapper>
      <ExcelInput
        startRow={0}
        data={fileData}
        setData={setFileData}
        tableStatus={uploadOrderStatus}
      >
        Select Excel or CSV
      </ExcelInput>
      {!!paymentOrders.length && (
        <Button onClick={addModelsInBatch}>
          {loading ? (
            <Spinner />
          ) : (
            `Upload ${paymentOrders.length} payment orders`
          )}
        </Button>
      )}
    </Wrapper>
  )
}

export default BatchUploadPaymentOrdersPage
