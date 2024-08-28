import { useEffect, useMemo, useState } from 'react'
import * as React from 'react'
import {
  Button,
  extractErrorMessage,
  FadeIn,
  Flex,
  isPressing,
  Keys,
  Paragraph,
  Shadowed,
  Spacing,
  TextArea,
  usePlatform,
} from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import gql from 'graphql-tag'
import styled from '@emotion/styled'
import { useUpdateSubclaimCauseMutation } from 'types/generated/graphql'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const UpdateCauseWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: row;
`

const CauseTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

gql`
  mutation UpdateSubclaimCause($subclaimId: ID!, $cause: String!) {
    subclaim_setCause(subclaimId: $subclaimId, cause: $cause) {
      id
      cause
    }
  }
`

export const SubclaimCause: React.FC<{
  subclaimId: string
}> = ({ subclaimId }) => {
  const { getSubclaim } = useClaim()
  const subclaim = getSubclaim(subclaimId)

  const storedCause = subclaim?.cause ?? ''

  const [updateSubclaimCause, { loading: creating }] =
    useUpdateSubclaimCauseMutation()

  const [cause, setCause] = useState('')
  const isInputValid = useMemo(
    () => !creating && storedCause !== cause,
    [storedCause, cause, creating],
  )

  const [textFieldFocused, setTextFieldFocused] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { isMetaKey, metaKey } = usePlatform()

  useEffect(() => {
    setCause(storedCause)
  }, [storedCause])

  const handleSubmit = () => {
    setIsEditing(false)
    toast.promise(
      updateSubclaimCause({
        variables: { subclaimId, cause },
        optimisticResponse: {
          subclaim_setCause: {
            __typename: 'Subclaim',
            id: subclaimId,
            cause,
          },
        },
      }),
      {
        loading: 'Loading',
        success: `Cause ${cause ? 'updated' : 'removed'}`,
        error: ({ message }) => {
          setIsEditing(true)
          return extractErrorMessage(message)
        },
      },
    )
  }

  return (
    <>
      {isEditing || !storedCause ? (
        <>
          <TextArea
            resize
            placeholder="Enter here..."
            value={cause}
            onChange={(e) => setCause(e.currentTarget.value)}
            onFocus={() => setTextFieldFocused(true)}
            onBlur={() => setTextFieldFocused(false)}
            onKeyDown={(e) => {
              if (isMetaKey(e) && isPressing(e, Keys.Enter) && isInputValid) {
                handleSubmit()
              }
            }}
          />
          <Spacing top="small" />
          <UpdateCauseWrapper>
            <Flex gap="small">
              <Button disabled={!isInputValid} onClick={handleSubmit}>
                {storedCause && !cause ? 'Remove info' : 'Update info'}
              </Button>
              {storedCause && (
                <Button
                  variant="tertiary"
                  onClick={() => {
                    setIsEditing(false)
                    setCause(storedCause)
                  }}
                >
                  Stop editing
                </Button>
              )}
            </Flex>
            {textFieldFocused && isInputValid && (
              <FadeIn duration={200}>
                <CauseTip>
                  Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
                  <Shadowed>Enter</Shadowed> to{' '}
                  {storedCause && !cause ? 'remove info' : 'update info'}
                </CauseTip>
              </FadeIn>
            )}
          </UpdateCauseWrapper>
        </>
      ) : (
        <>
          {storedCause}
          <Spacing top="small" />
          <Button
            onClick={() => {
              setIsEditing(true)
            }}
          >
            Edit
          </Button>
        </>
      )}
    </>
  )
}
