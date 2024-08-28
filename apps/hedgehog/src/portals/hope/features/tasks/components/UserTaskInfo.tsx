import { DetailedHTMLProps, DetailsHTMLAttributes } from 'react'
import { UserDataFragment } from 'types/generated/graphql'
import { convertFullNameToShort } from '@hedvig-ui'
import { Flex, Grid } from '@hedvig-ui/redesign'
import { Market, MarketFlags } from '@hope/features/config/constants'
import { TaskResourceAreaIcon } from '@hope/features/tasks/constants'

const UserTaskInfo: React.FC<
  {
    user: UserDataFragment
    userTaskCount: Record<string, number>
    selected: boolean
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void
  } & DetailedHTMLProps<DetailsHTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ user, userTaskCount, selected, onClick }) => {
  return (
    <Grid
      templateColumns="3fr 3fr 1fr 2fr"
      gap="md"
      style={{
        ...(selected && {
          cursor: 'not-allowed',
          userSelect: 'none',
        }),
      }}
      onClick={onClick}
    >
      <p>
        {convertFullNameToShort(user.fullName)} (
        {userTaskCount[user.email] ?? 0})
      </p>

      <Flex gap="xs" align="center">
        {user.areas.length
          ? user.areas
              .slice()
              .toSorted()
              .map((area) => (
                <span key={area}>
                  {area ? TaskResourceAreaIcon[area] : '🗻'}
                </span>
              ))
          : '💬'}
      </Flex>

      <Flex gap="xs" align="center">
        {user.markets.map((market) => (
          <span key={market}>{MarketFlags[market as Market]}</span>
        ))}
      </Flex>

      <Flex justify="flex-end" gap="xs" align="center">
        {user.resources.length === 0
          ? 'All'
          : user.resources.map((resource) => (
              <span key={resource}>{resource.charAt(0)}</span>
            ))}
      </Flex>
    </Grid>
  )
}

export default UserTaskInfo
