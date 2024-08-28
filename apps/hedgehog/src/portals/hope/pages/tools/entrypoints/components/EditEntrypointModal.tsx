import { useRef, useState } from 'react'
import * as React from 'react'
import {
  SidebarModal,
  Flex,
  Input,
  Button,
  isPressing,
  Keys,
  MultiDropdown,
  Label,
  StandaloneMessage,
  useConfirmDialog,
} from '@hedvig-ui'
import {
  EntrypointFragment,
  UpdateEntrypointInput,
} from 'types/generated/graphql'
import { useEntrypoints } from '../hooks'
import { useForm } from 'react-hook-form'
import styled from '@emotion/styled'
import { useTheme } from '@emotion/react'

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const MultiSelect = styled(MultiDropdown)`
  > div,
  > span {
    padding: 0.25rem 0.5rem;
    font-size: 1rem;
    height: auto;
  }
`

export const EditEntrypointModal = ({ onClose }: { onClose: () => void }) => {
  const {
    updateEntrypoint,
    isUpdatingEntrypoint,
    createEntrypoint,
    isCreatingEntrypoint,
    removeEntrypoint,
    isRemovingEntrypoint,
    selectedEntrypoint,
  } = useEntrypoints()
  const { id, displayName, keywords, acceptLanguage } =
    selectedEntrypoint as EntrypointFragment

  const [newKeywords, setNewKeywords] = useState(keywords)
  const keywordRef = useRef<HTMLInputElement>(null)

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      displayName,
    },
  })

  const submitHandler = (input: Omit<UpdateEntrypointInput, 'keywords'>) => {
    if (isUpdatingEntrypoint) return
    updateEntrypoint(id, { ...input, keywords: newKeywords }).then(() =>
      onClose(),
    )
  }

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPressing(e, Keys.Tab) || isPressing(e, Keys.Enter)) {
      const typedKeyword = keywordRef.current?.value
      if (!typedKeyword) return
      e.preventDefault()
      setNewKeywords((prev) => [...prev, typedKeyword])
      keywordRef.current.value = ''
    }
  }

  const { confirm } = useConfirmDialog()

  const theme = useTheme()

  const isEntrypointNonActive = !!selectedEntrypoint?.removedAt
  const nonActiveStyle = {
    border: `1px solid ${theme.danger}`,
    borderRadius: '6px',
    opacity: 0.5,
  }

  return (
    <SidebarModal
      title={isEntrypointNonActive ? '' : 'Edit entrypoint'}
      position="right"
      onClose={onClose}
    >
      <Flex direction="column" flex="0" gap="small" style={{ padding: '1rem' }}>
        <Form
          style={{
            padding: '1rem',
            width: '100%',
            ...(isEntrypointNonActive ? nonActiveStyle : {}),
          }}
          onSubmit={handleSubmit(submitHandler)}
        >
          <GridLayout>
            <Input
              disabled={isEntrypointNonActive}
              label="Display name"
              {...register('displayName')}
            />
            <Flex direction="column" wrap="wrap" style={{ gridColumn: '1/-1' }}>
              <Label>Keywords</Label>
              <GridLayout style={{ width: '100%' }}>
                <Input
                  disabled={isEntrypointNonActive}
                  placeholder="Enter keyword"
                  ref={keywordRef}
                  onKeyDown={handleKeywordKeyDown}
                />

                <MultiSelect
                  style={{
                    padding: '0.25rem 0.5rem',
                    cursor: isEntrypointNonActive ? 'default' : '',
                    pointerEvents: isEntrypointNonActive ? 'none' : 'auto',
                  }}
                  placeholder="No keywords set"
                  value={newKeywords}
                  options={newKeywords}
                  clearHandler={() => setNewKeywords([])}
                  onChange={(option) =>
                    setNewKeywords((prev) =>
                      prev.filter((val) => val !== option),
                    )
                  }
                />
              </GridLayout>
            </Flex>
          </GridLayout>
          <Flex gap="small">
            <Button
              type="submit"
              disabled={isUpdatingEntrypoint || isEntrypointNonActive}
            >
              Save
            </Button>
            <Button
              disabled={isEntrypointNonActive}
              type="button"
              variant="tertiary"
              onClick={() => {
                reset({ displayName })
                setNewKeywords(keywords)
                if (!keywordRef.current) return
                keywordRef.current.value = ''
              }}
            >
              Reset
            </Button>

            {!isEntrypointNonActive && (
              <Button
                type="button"
                status="danger"
                style={{ marginLeft: 'auto' }}
                onClick={() =>
                  confirm(
                    'This will deactivate the entrypoint',
                    'danger',
                    'Confirm',
                  ).then(() => removeEntrypoint(id))
                }
                disabled={isRemovingEntrypoint}
              >
                Deactivate entrypoint
              </Button>
            )}
          </Flex>
        </Form>
        {isEntrypointNonActive && (
          <Flex gap="tiny" align="center">
            <StandaloneMessage>
              This entrypoint is deactivated
            </StandaloneMessage>
            <Button
              status="success"
              onClick={() =>
                confirm('This will activate the entrypoint').then(() =>
                  createEntrypoint({ displayName, acceptLanguage }),
                )
              }
              disabled={isCreatingEntrypoint}
            >
              Activate
            </Button>
          </Flex>
        )}
      </Flex>
    </SidebarModal>
  )
}
