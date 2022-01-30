import { Link } from 'remix'
import { PageLink } from '~/lib/page-link'

const IndexPage = () => {
  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="font-bold">This is a demo:</h1>
      <Link to={PageLink.forever({ code: '8batky', locale: 'se-en' })}>
        <a>Forever page</a>
      </Link>
    </main>
  )
}

export default IndexPage
