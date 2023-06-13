import { CreateSessionForm } from './CreateSessionForm'
import { Wrapper } from './styles'

export const metadata = {
  robots: 'none',
}

const Page = () => {
  return (
    <Wrapper>
      <CreateSessionForm />
    </Wrapper>
  )
}

export default Page
