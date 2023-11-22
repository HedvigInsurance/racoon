import { CarTrialExtensionQuery, TrialContractFragment } from '@/services/apollo/generated'

export type CarTrialExtension = CarTrialExtensionQuery['carTrial']

// TODO: this is a workaround; ideally pillowSrc should be part of the TrialContractFragment
export type TrialContract = TrialContractFragment & { pillowSrc?: string }
