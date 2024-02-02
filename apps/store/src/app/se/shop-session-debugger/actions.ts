'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PageLink } from '@/utils/PageLink'

export const create = async (formData: FormData) => {
  const ssn = formData.get('ssn')

  if (typeof ssn !== 'string') {
    return
  }

  const response = await fetch(PageLink.apiSessionCreate(ssn))
  // TODO: Handle error
  if (!response.ok) {
    throw new Error("Couldn't create session")
  }

  cookies().set('hedvig_debugger_ssn', ssn)
  redirect(PageLink.cart({ locale: 'se-en' }).toString())
}
