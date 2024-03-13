'use server'

import { PageLink } from '@/utils/PageLink'

export const setupTrialContract = async (formData: FormData) => {
  await fetch(PageLink.apiCreateTrialContract(), {
    method: 'POST',
    body: formData,
  })
}
