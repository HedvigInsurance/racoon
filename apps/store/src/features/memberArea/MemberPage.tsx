import Head from 'next/head'
import {
  MemberAreaMemberInfoQuery,
  useMemberAreaMemberInfoQuery,
} from '@/services/apollo/generated'

export const MemberPage = () => {
  const { data, loading } = useMemberAreaMemberInfoQuery()

  return (
    <>
      <Head>
        <title>Member page</title>
        <meta name="robots" content="noindex,follow" />
      </Head>
      <div>
        <h1>TODO: header</h1>
        <p>TODO: Body</p>
        {loading && 'Loading...'}
        {data && <MemberInfo data={data} />}
      </div>
    </>
  )
}

type MemberInfoProps = {
  data: MemberAreaMemberInfoQuery
}
const MemberInfo = ({ data }: MemberInfoProps) => {
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  )
}
