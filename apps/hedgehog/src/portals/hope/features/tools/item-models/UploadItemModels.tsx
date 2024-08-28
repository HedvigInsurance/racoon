import { useEffect, useState } from 'react'
import {
  Button,
  ExcelInput,
  extractErrorMessage,
  FileUploadTableStatusType,
  Flex,
} from '@hedvig-ui'
import {
  CreateItemModelInput,
  useCreateItemModelMutation,
} from 'types/generated/graphql'
import { useItemModels } from '@hope/features/tools/item-models/useItemModels'

export const UploadItemModels = () => {
  const [createItemModel] = useCreateItemModelMutation()
  const { refetchModels } = useItemModels()
  const [itemModels, setItemModels] = useState<CreateItemModelInput[]>([])
  const [fileData, setFileData] = useState<string[][]>([])

  useEffect(() => {
    setItemModels(
      fileData.slice(1).map((cells) => {
        return {
          type: cells[0],
          brand: cells[1],
          name: cells[2],
          imageUrl: cells[3],
          deviceIds: cells[4]?.split(';'),
        }
      }),
    )
  }, [fileData])

  const [addModelStatus, setAddModelStatus] =
    useState<FileUploadTableStatusType>({})

  const addModelsInBatch = () => {
    const promises: Promise<void>[] = []
    itemModels.forEach(async (model, index) => {
      const type = model.type ?? 'OTHER'
      const brand = model.brand ?? 'OTHER'

      const promise = createItemModel({
        variables: {
          input: {
            type,
            brand,
            name: model.name as string,
            imageUrl: model.imageUrl,
            deviceIds: model.deviceIds,
          },
        },
      })
        .then(() => {
          setAddModelStatus((prev) => ({
            ...prev,
            [index]: { status: 'success', message: 'Added' },
          }))
        })
        .catch(({ message }) => {
          setAddModelStatus((prev) => ({
            ...prev,
            [index]: { status: 'error', message: extractErrorMessage(message) },
          }))
        })
      promises.push(promise)
    })
    Promise.all(promises).then(() => refetchModels())
  }

  return (
    <Flex direction="column" gap="small">
      <ExcelInput
        startRow={0}
        fileNameRequirement="ItemModels"
        data={fileData}
        setData={setFileData}
        tableStatus={addModelStatus}
      >
        Select Excel or CSV "ItemModels"
      </ExcelInput>
      {!!itemModels.length && (
        <Button onClick={addModelsInBatch}>
          Upload {itemModels.length} item models
        </Button>
      )}
    </Flex>
  )
}
