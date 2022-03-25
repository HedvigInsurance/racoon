import { NextPage } from 'next'

const EmbarkTestPage: NextPage = () => {
  return (
    <main>
      <h1>Landing page</h1>

      <form action="/api/embark/start" method="post">
        Start flow
        <input readOnly hidden name="redirectUrl" value="/dk-en/new-member/onboarding-home-DK" />
        <input readOnly hidden name="quoteCartId" value="866ba7de-5d90-4f13-826b-a2cc6c04dcd6" />
        <button type="submit">Start flow</button>
      </form>
    </main>
  )
}

export default EmbarkTestPage
