import { ActionFunction, Form, LoaderFunction, redirect, useActionData, useLoaderData } from 'remix'

import { Button } from '~/components/button'
import { CampaignCode } from '~/lib/campaign-code'
import { InputField } from '~/components/input-field'
import { PageLayout } from '~/components/page-layout'
import { PageLink } from '~/lib/page-link'
import invariant from 'tiny-invariant'

type LoaderData = { campaignCode?: string }

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  return {
    campaignCode: params.code,
  }
}

type FormError = { code?: boolean }

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.locale, 'locale is required')

  const formParams = await request.formData()
  const code = formParams.get('code')

  const errors: FormError = {}
  if (!code) errors.code = true

  if (Object.keys(errors).length) {
    return errors
  }

  invariant(typeof code === 'string')

  return redirect(PageLink.forever({ code, locale: params.locale }), {
    headers: {
      'Set-Cookie': await CampaignCode.save(code),
    },
  })
}

const ForeverCodePage = () => {
  const data = useLoaderData<LoaderData>()
  const errors = useActionData<FormError>()

  return (
    <Form method="post">
      <PageLayout className="lg:space-y-6" code={data.campaignCode}>
        <div className="flex-1 flex flex-col justify-center space-y-2 lg:flex-initial">
          <label className="text-gray-900 text-sm leading-snug">
            FOREVER_LANDINGPAGE_INPUT_TEXT
          </label>
          <InputField
            data-cy="code-input"
            type="text"
            name="code"
            placeholder="7VEKCAG"
            required
            errorMessage={errors?.code ? 'FOREVER_LANDINGPAGE_INPUT_ERROR' : undefined}
          />
        </div>

        <Button type="submit">FOREVER_LANDINGPAGE_BTN_LABEL</Button>
      </PageLayout>
    </Form>
  )
}

export default ForeverCodePage
