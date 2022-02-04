import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
  useTransition,
} from 'remix'
import { CampaignDocument, CampaignQuery, CampaignQueryVariables } from '~/lib/generated-types'

import { Button } from '~/components/button'
import { CampaignCode } from '~/lib/campaign-code'
import { InputField } from '~/components/input-field'
import { PageLayout } from '~/components/page-layout'
import { PageLink } from '~/lib/page-link'
import { apolloClient } from '~/services/apollo'
import { i18n } from '~/i18n.server'
import invariant from 'tiny-invariant'
import { replaceMarkdown } from '~/services/markdown.server'
import { useTranslation } from 'react-i18next'

type LoaderData = {
  campaignCode: string
  i18n: any
}

export const meta: MetaFunction = ({ parentsData }) => {
  return {
    title: parentsData.root.i18n.common.FOREVER_LANDINGPAGE_TITLE,
    'og:title': parentsData.root.i18n.common.FOREVER_LANDINGPAGE_TITLE,
    'og:description': parentsData.root.i18n.common.FOREVER_LANDINGPAGE_DESCRIPTION,
    'og:image': 'https://www.hedvig.com/new-member-assets/social/forever-notifications.jpg',
  }
}

export const loader: LoaderFunction = async ({ params }): Promise<LoaderData> => {
  invariant(params.code)
  invariant(params.locale)

  const translations = await replaceMarkdown(await i18n.getTranslations(params.locale, 'common'), [
    'FOREVER_LANDINGPAGE_INFO_TEXT',
  ])

  return {
    i18n: translations,
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

  try {
    const { data } = await apolloClient.query<CampaignQuery, CampaignQueryVariables>({
      query: CampaignDocument,
      variables: { code },
    })

    if (!data.campaign) {
      return { code: true }
    }

    return redirect(PageLink.landing({ locale: params.locale }), {
      headers: {
        'Set-Cookie': await CampaignCode.save(code),
      },
    })
  } catch (error) {
    return { code: true }
  }
}

const ForeverCodePage = () => {
  const data = useLoaderData<LoaderData>()
  const errors = useActionData<FormError>()
  const { t } = useTranslation('common')
  const { state } = useTransition()

  return (
    <Form method="post">
      <PageLayout className="lg:space-y-6" code={data.campaignCode}>
        <div className="flex-1 flex flex-col justify-center space-y-2 lg:flex-initial">
          <label className="text-gray-900 text-sm leading-snug">
            {t('FOREVER_LANDINGPAGE_INPUT_TEXT')}
          </label>
          <InputField
            data-cy="code-input"
            type="text"
            name="code"
            placeholder="7VEKCAG"
            required
            errorMessage={errors?.code ? t('FOREVER_LANDINGPAGE_INPUT_ERROR') : undefined}
          />
        </div>

        <Button type="submit" loading={state === 'submitting'}>
          {t('FOREVER_LANDINGPAGE_BTN_LABEL')}
        </Button>
      </PageLayout>
    </Form>
  )
}

export default ForeverCodePage
