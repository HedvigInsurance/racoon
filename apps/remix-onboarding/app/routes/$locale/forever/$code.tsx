import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
} from 'remix'

import { Button } from '~/components/button'
import { CampaignCode } from '~/lib/campaign-code'
import { InputField } from '~/components/input-field'
import { PageLayout } from '~/components/page-layout'
import { PageLink } from '~/lib/page-link'
import { i18n } from '~/i18n.server'
import invariant from 'tiny-invariant'
import { useTranslation } from 'react-i18next'

export const meta: MetaFunction = () => ({
  title: 'FOREVER_LANDINGPAGE_TITLE',
  'og:title': 'FOREVER_LANDINGPAGE_TITLE',
  'og:description': 'FOREVER_LANDINGPAGE_DESCRIPTION',
  'og:image': 'https://www.hedvig.com/new-member-assets/social/forever-notifications.jpg',
})

export const loader: LoaderFunction = async ({ request, params }) => {
  return {
    campaignCode: params.code,
    i18n: await i18n.getTranslations(request, ['common']),
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
  const data = useLoaderData()
  const errors = useActionData<FormError>()
  const { t } = useTranslation()

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

        <Button type="submit">{t('FOREVER_LANDINGPAGE_BTN_LABEL')}</Button>
      </PageLayout>
    </Form>
  )
}

export default ForeverCodePage
