import { createContext, PropsWithChildren, useContext } from 'react'
import * as React from 'react'
import gql from 'graphql-tag'
import {
  AdminSystemUserFragment,
  ClaimCoInsuredFragment,
  ClaimCounterpartyFragment,
  ClaimDetailsQuery,
  ClaimFileFragment,
  ClaimInsurableLimitsFragment,
  ClaimItemFragment,
  ClaimMemberFragment,
  ClaimMemberStatementFragment,
  ClaimNoteFragment,
  ClaimPetDiagnosisFragment,
  ClaimSubclaimFragment,
  ClaimTranscription,
  ContractFragment,
  ConversationFragment,
  GenericAgreementFragment,
  ResourceAccessFragment,
  SanctionStatus,
  TagFragment,
  TaskFragment,
  TaskResourceArea,
  useClaimDetailsQuery,
} from 'types/generated/graphql'
import { ApolloError, ApolloQueryResult } from '@apollo/client'
import {
  Flex,
  LoadingMessage,
  Shadowed,
  StandaloneMessage,
  useSearchParamsState,
} from '@hedvig-ui'
import { ShieldLockFill } from 'react-bootstrap-icons'
import { parseISO } from 'date-fns'

gql`
  query ClaimDetails($claimId: ID!) {
    claim(id: $claimId) {
      ...ClaimDetails
    }
  }
`

type ClaimContextValue = {
  claimId: string
  claimNumber: string
  claimState: string
  assignedAdmin: AdminSystemUserFragment | undefined
  claimRegistrationDate: string
  claimOpenedAt: string
  dateOfOccurrence: string | undefined
  claimTranscriptions: ClaimTranscription[]
  recordingUrl: string | undefined
  memberFreeText: string | undefined
  notes: ClaimNoteFragment[]
  subclaims: ClaimSubclaimFragment[]
  getSubclaim: (subclaimId: string) => ClaimSubclaimFragment | undefined
  member: ClaimMemberFragment
  isPotentiallySanctioned: boolean
  items: ClaimItemFragment[]
  contract: ContractFragment | undefined
  agreement: GenericAgreementFragment | undefined
  insurableLimits: ClaimInsurableLimitsFragment | undefined
  petDiagnoses: ClaimPetDiagnosisFragment[]
  location: string | undefined
  coveringEmployee: boolean
  coInsured: ClaimCoInsuredFragment | undefined
  counterparties: ClaimCounterpartyFragment[]
  restriction: ResourceAccessFragment | undefined
  memberStatement: ClaimMemberStatementFragment | undefined
  files: ClaimFileFragment[]
  conversation: ConversationFragment | undefined
  tags: TagFragment[]
  tasks: TaskFragment[]
  scheduledTasks: TaskFragment[]
  lastTaskArea: TaskResourceArea | undefined
  memberId: string
  preferredCurrency: string | undefined
  currentSubclaimId: string | undefined
  setCurrentSubclaimId: (subclaimId: string) => void
  error: ApolloError | undefined
  loading: boolean
  refetch: () => Promise<ApolloQueryResult<ClaimDetailsQuery>>
}

const ClaimContext = createContext<ClaimContextValue>({
  claimId: '',
  claimNumber: '',
  claimState: '',
  assignedAdmin: undefined,
  claimRegistrationDate: '',
  claimOpenedAt: '',
  dateOfOccurrence: undefined,
  claimTranscriptions: [],
  recordingUrl: undefined,
  memberFreeText: undefined,
  notes: [],
  subclaims: [],
  items: [],
  contract: undefined,
  agreement: undefined,
  insurableLimits: undefined,
  petDiagnoses: [],
  location: undefined,
  coveringEmployee: false,
  coInsured: undefined,
  counterparties: [],
  restriction: undefined,
  memberStatement: undefined,
  files: [],
  conversation: undefined,
  tags: [],
  tasks: [],
  scheduledTasks: [],
  lastTaskArea: undefined,
  getSubclaim: () => undefined,
  member: {} as ClaimMemberFragment,
  isPotentiallySanctioned: false,
  memberId: '',
  preferredCurrency: undefined,
  currentSubclaimId: undefined,
  setCurrentSubclaimId: () => null,
  error: undefined,
  loading: false,
  refetch: () => new Promise(() => null),
})

export const useClaim = () => useContext(ClaimContext)

export const ClaimProvider: React.FC<
  PropsWithChildren & { claimId: string }
> = ({ children, claimId }) => {
  const { data, error, loading, refetch } = useClaimDetailsQuery({
    variables: { claimId },
  })
  const [currentSubclaimId, setCurrentSubclaimId] = useSearchParamsState(
    'subclaimId',
    data?.claim?.subclaims?.[0]?.id ?? '',
  )

  const restriction = data?.claim?.restriction ?? undefined

  if (loading) {
    return <LoadingMessage />
  }

  if (error?.message.includes('Claim is restricted') && !!restriction) {
    return (
      <StandaloneMessage opacity={0.5}>
        <Flex align="center" justify="center" direction="column">
          <div style={{ fontSize: '2em' }}>
            <ShieldLockFill />
          </div>
          <div>This claim is restricted</div>
          <div style={{ fontSize: '0.7em' }}>
            Contact <Shadowed>{restriction.restrictedBy.fullName}</Shadowed> if
            you want access
          </div>
        </Flex>
      </StandaloneMessage>
    )
  }

  if (!data?.claim || !!error) {
    return <StandaloneMessage>Claim not found</StandaloneMessage>
  }

  const claimNumber = data.claim.claimNumber
  const dateOfOccurrence = data.claim.dateOfOccurrence
  const claimState = data.claim.state
  const assignedAdmin = data.claim.assignedAdmin ?? undefined
  const claimRegistrationDate = data.claim.registrationDate
  const claimOpenedAt = data.claim.openedAt
  const claimTranscriptions = data.claim.transcriptions ?? []
  const recordingUrl = data.claim.recordingUrl ?? undefined
  const memberFreeText = data.claim.memberFreeText ?? undefined
  const notes = data.claim.notes
  const subclaims: ClaimSubclaimFragment[] = data.claim.subclaims ?? []
  const member = data.claim.member
  const items = data.claim.items ?? []
  const contract = data.claim.contract ?? undefined
  const agreement = data.claim.agreement ?? undefined
  const insurableLimits = data.claim.insurableLimits ?? undefined
  const petDiagnoses = data.claim.petDiagnoses ?? []
  const tasks = data.claim.tasks ?? []
  const scheduledTasks = tasks.filter((task) => !!task.assignableFrom)
  const lastTaskArea =
    tasks.length > 0
      ? (tasks.toSorted(
          (a, b) =>
            parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime(),
        )[0].area ?? undefined)
      : undefined
  const location = data.claim.location ?? undefined
  const counterparties = data.claim.counterparties ?? []
  const coveringEmployee = data.claim.coveringEmployee
  const coInsured = data.claim.coInsured ?? undefined
  const memberStatement = data.claim.memberStatement ?? undefined
  const files = data.claim.claimFiles ?? []
  const conversation = data.claim.conversation ?? undefined
  const tags = data.claim.tags ?? []
  const isPotentiallySanctioned =
    member?.sanctionStatus === SanctionStatus.Undetermined ||
    member?.sanctionStatus === SanctionStatus.PartialHit

  const getSubclaim = (subclaimId: string) =>
    subclaims.find((subclaim) => subclaim.id === subclaimId)

  return (
    <ClaimContext.Provider
      value={{
        claimId,
        claimNumber,
        claimState,
        assignedAdmin,
        claimRegistrationDate,
        claimOpenedAt,
        dateOfOccurrence,
        claimTranscriptions,
        recordingUrl,
        memberFreeText,
        notes,
        subclaims,
        getSubclaim,
        member,
        isPotentiallySanctioned,
        items,
        contract,
        agreement,
        insurableLimits,
        petDiagnoses,
        location,
        coveringEmployee,
        coInsured,
        counterparties,
        restriction,
        memberStatement,
        files,
        conversation,
        tags,
        tasks,
        scheduledTasks,
        lastTaskArea,
        memberId: member.memberId,
        preferredCurrency: member?.contractMarketInfo?.preferredCurrency,
        currentSubclaimId,
        setCurrentSubclaimId,
        error,
        loading,
        refetch,
      }}
    >
      {children}
    </ClaimContext.Provider>
  )
}
