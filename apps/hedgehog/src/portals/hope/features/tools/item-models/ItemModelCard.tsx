import { useRef, useState } from 'react'
import * as React from 'react'
import { ItemModel } from 'types/generated/graphql'
import { useItemModels } from '@hope/features/tools/item-models/useItemModels'
import {
  Input,
  isPressing,
  Keys,
  useClickOutside,
  useConfirmDialog,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import { Trash } from 'react-bootstrap-icons'

const ModelCard = styled.div`
  position: relative;
  display: grid;
  grid-auto-flow: column;
  background-color: ${({ theme }) => theme.accentBackground};
  border-radius: ${({ theme }) => theme.spacing.tiny};
  overflow: hidden;

  img {
    width: 10rem;
  }
`

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  width: 200px;
`

const ModelName = styled.span`
  font-size: ${({ theme }) => theme.fontSize.huge};
  margin-bottom: auto;
`

const RemoveButton = styled(Trash)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.mutedText};

  &:hover {
    color: ${({ theme }) => theme.danger};
  }

  & *,
  *::after,
  *::before {
    transition: none;
  }
`

const EditingInput = styled(Input)`
  border: none;
  background-color: transparent;
  padding: 0;
  font-size: inherit;
  letter-spacing: inherit;
`

const EditingSelect = styled.select`
  cursor: pointer;
  width: max-content;
  border: none;
  outline: none;
  background: transparent;
  opacity: 0.7;
  transition: all 100ms ease;

  font-size: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  -ms-appearance: none;

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.accent};
  }
`

export const ItemModelCard = ({ itemModel }: { itemModel: ItemModel }) => {
  const { id, name, brand, type, imageUrl } = itemModel
  const { itemModelTypes, itemModelBrands, updateModel, removeModel } =
    useItemModels()

  const [isEditingName, setIsEditingName] = useState(false)
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
  }

  const { confirm } = useConfirmDialog()
  const [isHoveringCard, setIsHoveringCard] = useState(false)

  return (
    <ModelCard
      onMouseEnter={() => setIsHoveringCard(true)}
      onMouseLeave={() => setIsHoveringCard(false)}
    >
      {isHoveringCard && (
        <RemoveButton
          onClick={() =>
            confirm('Delete item model?').then(() => removeModel(id))
          }
        />
      )}
      <CardInfo>
        <ModelName onDoubleClick={() => setIsEditingName(true)}>
          {isEditingName ? (
            <EditingInput
              onKeyDown={(e) => handleInputKeydown(e, nameRef)}
              defaultValue={name}
              ref={nameRef}
              autoFocus
              onBlur={() => setIsEditingName(false)}
            />
          ) : (
            name
          )}
        </ModelName>
        <EditingSelect
          defaultValue={type}
          onChange={async (e) => {
            await updateModel(id, { type: e.target.value })
          }}
        >
          {itemModelTypes.map(({ name, displayName }) => (
            <option key={name} value={name}>
              {displayName}
            </option>
          ))}
        </EditingSelect>

        <EditingSelect
          defaultValue={brand}
          onChange={async (e) => {
            await updateModel(id, { brand: e.target.value })
          }}
        >
          {itemModelBrands.map(({ name, displayName }) => (
            <option key={name} value={name}>
              {displayName}
            </option>
          ))}
        </EditingSelect>
      </CardInfo>
      {imageUrl && <img src={imageUrl} alt={name} />}
    </ModelCard>
  )
}
