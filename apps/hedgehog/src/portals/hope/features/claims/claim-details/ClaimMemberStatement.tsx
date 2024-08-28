import { useEffect, useMemo, useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import gql from 'graphql-tag'
import { toast } from 'react-hot-toast'
import { InfoCircle } from 'react-bootstrap-icons'
import {
  Button,
  CardTitle,
  extractErrorMessage,
  FadeIn,
  Flex,
  Input,
  isPressing,
  Keys,
  Paragraph,
  Shadowed,
  Spacing,
  TextArea,
  useConfirmDialog,
  usePlatform,
} from '@hedvig-ui'
import {
  ClaimMemberStatementFragment,
  useUpdateClaimMemberStatementMutation,
} from 'types/generated/graphql'
import { useClaim } from '@hope/features/claims/hooks/use-claim'

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`

const SubmitMemberStatementWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`

const SubmitTip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

gql`
  mutation UpdateClaimMemberStatement(
    $claimId: ID!
    $memberStatement: ClaimMemberStatementInput
  ) {
    claim_updateMemberStatement(
      id: $claimId
      memberStatement: $memberStatement
    ) {
      id
      memberStatement {
        ...ClaimMemberStatement
      }
    }
  }
`

const ClaimMemberStatement: React.FC<{
  claimId: string
  isEditing: boolean
  setIsEditing: (value: boolean) => void
}> = ({ claimId, isEditing, setIsEditing }) => {
  const [updateMemberStatement, { loading: updating }] =
    useUpdateClaimMemberStatementMutation()

  const { memberStatement } = useClaim()
  const generalStatement = memberStatement?.generalStatement ?? ''
  const liableParty = memberStatement?.liableParty ?? ''
  const reasonOfLiability = memberStatement?.reasonOfLiability ?? ''

  const { isMetaKey, metaKey } = usePlatform()
  const [textFieldFocused, setTextFieldFocused] = useState(false)

  const [input, setInput] = useState<ClaimMemberStatementFragment>({
    generalStatement: '',
    liableParty: '',
    reasonOfLiability: '',
  })

  const handleUpdateInput = (
    name: keyof ClaimMemberStatementFragment,
    value: string,
  ) => {
    setInput((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }))
  }

  const { confirm: confirmDelete } = useConfirmDialog()

  useEffect(() => {
    if (generalStatement)
      handleUpdateInput('generalStatement', generalStatement)
    if (liableParty) handleUpdateInput('liableParty', liableParty)
    if (reasonOfLiability)
      handleUpdateInput('reasonOfLiability', reasonOfLiability)
  }, [generalStatement, liableParty, reasonOfLiability])

  const isInputValid = useMemo(
    () =>
      input.generalStatement &&
      input.reasonOfLiability &&
      input.liableParty &&
      !(
        input.generalStatement === generalStatement &&
        input.liableParty === liableParty &&
        input.reasonOfLiability === reasonOfLiability
      ),
    [
      generalStatement,
      liableParty,
      reasonOfLiability,
      input.generalStatement,
      input.reasonOfLiability,
      input.liableParty,
    ],
  )

  const handleSubmit = (
    memberStatement: ClaimMemberStatementFragment | null,
  ) => {
    toast.promise(
      updateMemberStatement({
        variables: { claimId, memberStatement },
        optimisticResponse: {
          claim_updateMemberStatement: {
            __typename: 'Claim',
            id: claimId,
            memberStatement,
          },
        },
      }),
      {
        loading: 'Loading...',
        success: () => {
          if (!memberStatement) {
            setInput({
              generalStatement: '',
              liableParty: '',
              reasonOfLiability: '',
            })
          }
          setIsEditing(false)
          return `Member statement ${memberStatement ? 'updated' : 'deleted'}`
        },
        error: ({ message }) => extractErrorMessage(message),
      },
    )
  }

  if (!isEditing)
    return (
      <Flex justify="center" align="center">
        <Button variant="tertiary" onClick={() => setIsEditing(true)}>
          <Flex align="flex-end" gap="small">
            {memberStatement ? 'Show member statement' : 'Add member statement'}{' '}
            <InfoCircle />
          </Flex>
        </Button>
      </Flex>
    )

  return (
    <>
      <Flex align="center" justify="space-between">
        <CardTitle title="Member statement" />
        {memberStatement && (
          <Button
            disabled={updating}
            status="danger"
            onClick={() => {
              confirmDelete(
                'Are you sure you want to delete member statement?',
              ).then(() => {
                handleSubmit(null)
              })
            }}
          >
            Delete
          </Button>
        )}
      </Flex>
      <Spacing top="small" />
      <FormWrapper>
        <TextArea
          resize
          label="General statement"
          placeholder="Enter here..."
          value={updating ? '' : input.generalStatement}
          onChange={(e) =>
            handleUpdateInput('generalStatement', e.currentTarget.value)
          }
          onKeyDown={(e) => {
            if (
              isMetaKey(e) &&
              isPressing(e, Keys.Enter) &&
              !updating &&
              isInputValid
            ) {
              handleSubmit(input)
            }
          }}
          onFocus={() => setTextFieldFocused(true)}
          onBlur={() => setTextFieldFocused(false)}
        />

        <Input
          label="Liable party"
          placeholder="Enter here..."
          value={updating ? '' : input.liableParty}
          onChange={(e) =>
            handleUpdateInput('liableParty', e.currentTarget.value)
          }
          onKeyDown={(e) => {
            if (
              isMetaKey(e) &&
              isPressing(e, Keys.Enter) &&
              !updating &&
              isInputValid
            ) {
              handleSubmit(input)
            }
          }}
          onFocus={() => setTextFieldFocused(true)}
          onBlur={() => setTextFieldFocused(false)}
        />

        <Input
          label="Reason of liability"
          placeholder="Enter here..."
          value={updating ? '' : input.reasonOfLiability}
          onChange={(e) =>
            handleUpdateInput('reasonOfLiability', e.currentTarget.value)
          }
          onKeyDown={(e) => {
            if (
              isMetaKey(e) &&
              isPressing(e, Keys.Enter) &&
              !updating &&
              isInputValid
            ) {
              handleSubmit(input)
            }
          }}
          onFocus={() => setTextFieldFocused(true)}
          onBlur={() => setTextFieldFocused(false)}
        />

        <SubmitMemberStatementWrapper>
          <Button
            disabled={!isInputValid || updating}
            onClick={() => handleSubmit(input)}
          >
            Update info
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              setInput({
                generalStatement,
                liableParty,
                reasonOfLiability,
              })
              setIsEditing(false)
            }}
          >
            Stop editing
          </Button>
          {textFieldFocused && isInputValid && (
            <FadeIn duration={200} style={{ marginLeft: 'auto' }}>
              <SubmitTip>
                Press <Shadowed>{metaKey.hint}</Shadowed> +{' '}
                <Shadowed>Enter</Shadowed> to update info
              </SubmitTip>
            </FadeIn>
          )}
        </SubmitMemberStatementWrapper>
      </FormWrapper>
    </>
  )
}

export { ClaimMemberStatement }
