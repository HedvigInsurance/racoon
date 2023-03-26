import { apolloClient } from 'app/apollo'
import {
  ShopSessionDocument,
  ShopSessionQuery,
  ShopSessionQueryVariables,
} from '@/services/apollo/generated'

type Props = {
  searchParams?: { id: string }
}

const Page = async ({ searchParams }: Props) => {
  const shopSessionId = searchParams?.id

  const { data } = await apolloClient.query<ShopSessionQuery, ShopSessionQueryVariables>({
    query: ShopSessionDocument,
    variables: { shopSessionId },
  })

  return (
    <div>
      <h1>Shop Session</h1>
      <p>{searchParams?.id}</p>

      <section>
        <h2>Customer</h2>
        <table>
          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>SSN</th>
              <th>Auth</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.shopSession.customer?.firstName}</td>
              <td>{data.shopSession.customer?.lastName}</td>
              <td>{data.shopSession.customer?.ssn}</td>
              <td>{data.shopSession.customer?.authenticationStatus}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Cart ({data.shopSession.cart.id})</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Id</th>
            </tr>
          </thead>
          <tbody>
            {data.shopSession.cart.entries.map((item) => (
              <tr key={item.id}>
                <td>{item.variant.product.name}</td>
                <td>{item.variant.typeOfContract}</td>
                <td>{item.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default Page
