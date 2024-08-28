import { getClient } from 'gql/client'

export default async function UsersPage() {
  const client = await getClient()
  const { data } = await client.Users()

  const { users } = data

  return (
    <div>
      <h1>Users</h1>

      {users.length > 0 ? (
        <ul id="users-list">
          {users.map((user) => (
            <li key={user.id}>{user.fullName}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
