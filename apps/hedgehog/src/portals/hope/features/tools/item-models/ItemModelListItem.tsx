import styled from '@emotion/styled'
import { useState, useRef } from 'react'
import * as React from 'react'
import { Pencil, Trash } from 'react-bootstrap-icons'
import {
  useClickOutside,
  isPressing,
  Keys,
  useConfirmDialog,
  Flex,
  TableRow,
  Input,
  SearchableDropdown,
  Button,
} from '@hedvig-ui'
import { ItemModel } from 'types/generated/graphql'
import { useItemModels } from './useItemModels'

const TableCell = styled.td`
  padding: 0.25rem 0.5rem !important;
`

export const ItemModelListItem = ({ itemModel }: { itemModel: ItemModel }) => {
  const { id, name, brand, type } = itemModel
  const { itemModelTypes, itemModelBrands, updateModel, removeModel } =
    useItemModels()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isHoveringName, setIsHoveringName] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  useClickOutside(nameRef, () => setIsEditingName(false))

  const handleInputKeydown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
    ref: React.RefObject<HTMLInputElement | undefined>,
  ) => {
    if (!ref.current) {
      return
    }
    if (isPressing(e, Keys.Enter)) {
      await updateModel(id, { name: ref.current.value })
      ref.current.blur()
    }
    if (isPressing(e, Keys.Escape)) {
      setIsEditingName(false)
    }
  }

  const { confirm } = useConfirmDialog()
  return (
    <TableRow>
      <TableCell
        onMouseEnter={() => setIsHoveringName(true)}
        onMouseLeave={() => setIsHoveringName(false)}
      >
        <Flex justify="space-between" align="center" flex="0" gap="small">
          {isEditingName ? (
            <>
              <Input
                onKeyDown={(e) => handleInputKeydown(e, nameRef)}
                defaultValue={name}
                ref={nameRef}
                autoFocus
                onBlur={() => setIsEditingName(false)}
              />
            </>
          ) : (
            <>
              <span>{name}</span>
              {isHoveringName && (
                <Button
                  icon={<Pencil />}
                  onClick={() => setIsEditingName(true)}
                />
              )}
            </>
          )}
        </Flex>
      </TableCell>
      <TableCell>
        <SearchableDropdown
          value={type}
          onChange={async (option) => {
            if (!option?.value) return
            await updateModel(id, { type: option.value as string })
          }}
          options={itemModelTypes.map((typeOption) => ({
            key: typeOption.name,
            value: typeOption.name,
            label: typeOption.displayName,
          }))}
        />
      </TableCell>
      <TableCell>
        <SearchableDropdown
          value={brand}
          onChange={async (option) => {
            if (!option?.value) return
            await updateModel(id, { brand: option.value as string })
          }}
          options={itemModelBrands.map((typeOption) => ({
            key: typeOption.name,
            value: typeOption.name,
            label: typeOption.displayName,
          }))}
        />
      </TableCell>
      <TableCell style={{ textAlign: 'right' }}>
        <Button
          status="danger"
          icon={<Trash />}
          onClick={() =>
            confirm('Delete item model?', 'danger', 'Delete').then(() =>
              removeModel(id),
            )
          }
        />
      </TableCell>
    </TableRow>
  )
}
