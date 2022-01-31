import { ActionFunction, Form, LoaderFunction, redirect, useLoaderData, useTransition } from 'remix'

import { CampaignCode } from '~/lib/campaign-code'
import { PageLink } from '~/lib/page-link'
import invariant from 'tiny-invariant'

type LoaderData = { campaignCode?: string }

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  return {
    campaignCode: params.code,
  }
}

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.locale, 'locale is required')

  const formParams = await request.formData()
  const campaignCode = formParams.get('campaignCode')

  if (typeof campaignCode !== 'string') {
    return redirect('/')
  }

  return redirect(PageLink.forever({ code: campaignCode, locale: params.locale }), {
    headers: {
      'Set-Cookie': await CampaignCode.save(campaignCode),
    },
  })
}

const ForeverCodePage = () => {
  const data = useLoaderData<LoaderData>()
  const { submission } = useTransition()

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="font-bold">Forever</h1>

      <Form method="post">
        <input
          type="text"
          name="campaignCode"
          placeholder="Campaign Code"
          className="border border-gray-400 p-2 w-full"
          defaultValue={data.campaignCode}
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {submission ? 'Submitting...' : 'Submit'}
        </button>
      </Form>
    </main>
  )
}

export default ForeverCodePage
