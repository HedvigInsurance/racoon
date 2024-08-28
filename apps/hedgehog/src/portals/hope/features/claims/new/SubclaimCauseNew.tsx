import { useEffect, useMemo, useState } from 'react'
import {
  extractErrorMessage,
  FadeIn,
  isPressing,
  Keys,
  Label,
  Paragraph,
  Shadowed,
  usePlatform,
} from '@hedvig-ui'
import { toast } from 'react-hot-toast'
import gql from 'graphql-tag'
import styled from '@emotion/styled'
import { useUpdateSubclaimCauseMutation } from 'types/generated/graphql'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import { Input, Flex, Button } from '@hedvig-ui/redesign'

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

export const SubclaimCauseNew: React.FC<{
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
        <Flex direction="column" gap="small">
          <Input
            label="Cause"
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
          <Flex justify="space-between" align="center">
            <Flex gap="small">
              <Button
                size="small"
                disabled={!isInputValid}
                onClick={handleSubmit}
              >
                {storedCause && !cause ? 'Remove info' : 'Update info'}
              </Button>
              {storedCause && (
                <Button
                  size="small"
                  variant="ghost"
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
              <FadeIn duration={200} style={{ flexShrink: 0 }}>
                <CauseTip>
                  Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
                  <Shadowed>Enter</Shadowed> to{' '}
                  {storedCause && !cause ? 'remove info' : 'update info'}
                </CauseTip>
              </FadeIn>
            )}
          </Flex>
        </Flex>
      ) : (
        <Flex direction="column" gap="small">
          <div>
            <Label>Cause</Label>
            <span style={{ maxWidth: '100%', wordWrap: 'break-word' }}>
              {storedCause}
            </span>
          </div>
          <div>
            <Button
              size="small"
              onClick={() => {
                setIsEditing(true)
              }}
            >
              Edit
            </Button>
          </div>
        </Flex>
      )}
    </>
  )
}
