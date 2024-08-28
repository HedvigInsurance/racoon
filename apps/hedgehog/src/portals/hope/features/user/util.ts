import { SystemUser } from 'types/generated/graphql'

export const extractPerformedBy = (
  systemUser?: SystemUser | null,
  includeMemberId: boolean = true,
): string | null => {
  switch (systemUser?.__typename) {
    case 'AdminSystemUser':
    case 'EmailSystemUser':
      return `${systemUser.name}`
    case 'MemberSystemUser':
      return includeMemberId ? `Member (${systemUser.memberId})` : 'Member'
    default:
      return null
  }
}
