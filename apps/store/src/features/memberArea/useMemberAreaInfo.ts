import {
  MemberAreaMemberInfoQuery,
  useMemberAreaMemberInfoQuery,
} from '@/services/graphql/generated'

export const useMemberAreaInfo = (): MemberAreaMemberInfoQuery['currentMember'] => {
  const { data } = useMemberAreaMemberInfoQuery()
  if (!data) {
    throw Error('Incorrect use, MemberAreaMemberInfoQuery must be loaded at this point')
  }
  return data.currentMember
}