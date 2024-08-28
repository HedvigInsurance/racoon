'use server'

import { getClient } from 'gql/client'
import { FormStateWithErrors } from 'app/types/formStateTypes'
import gql from 'graphql-tag'
import { revalidatePath } from 'next/cache'

gql`
  query SwitcherCases {
    switcherCases {
      ...SwitcherCase
    }
  }

  fragment SwitcherCase on SwitcherCase {
    id
    member {
      memberId
      firstName
      lastName
      email
    }
    currentInsurer
    pendingContract {
      id
      insuranceType
      createdAt
    }
    mandatePdfUrl
    events {
      ...SwitcherCaseEvent
    }
  }

  fragment SwitcherCaseEvent on SwitcherCaseEvent {
    id
    createdAt
    type
    note
    actor {
      ...AdminSystemUser
    }
  }
`

export async function getSwticherCases() {
  const client = await getClient()
  const { data } = await client.SwitcherCases()

  return data.switcherCases
}

type CompleteSwitcherCaseParams = {
  id: string
  startDate: string
}

gql`
  mutation SwitcherCaseComplete($id: ID!, $startDate: Date!) {
    switcher_complete(id: $id, startDate: $startDate) {
      ...SwitcherCase
    }
  }
`

export async function completeSwitcherCase({
  id,
  startDate,
}: CompleteSwitcherCaseParams) {
  const client = await getClient()
  const { data } = await client.SwitcherCaseComplete({ id, startDate })

  revalidatePath('/tools/switching')

  return data?.switcher_complete
}

gql`
  mutation SwitcherCaseAddNote($id: ID!, $note: String!) {
    switcher_addNote(id: $id, note: $note) {
      ...SwitcherCase
    }
  }
`
export async function addSwitcherCaseNote(
  _: FormStateWithErrors,
  formData: FormData,
): Promise<FormStateWithErrors> {
  try {
    const id = formData.get('id') as string
    const note = formData.get('note') as string

    if (!note) {
      return {
        success: false,
        errors: {
          fields: {
            note: 'Can not create an empty note!',
          },
        },
      }
    }

    const client = await getClient()
    await client.SwitcherCaseAddNote({ id, note })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: {
          generic: [error.message],
        },
      }
    }

    return { success: false }
  } finally {
    revalidatePath('/tools/switching')
  }
}

gql`
  mutation SwitcherCaseManualReminderSent($id: ID!) {
    switcher_manualReminderSent(id: $id) {
      ...SwitcherCase
    }
  }
`

export async function markSwitcherCaseAsReminded(id: string) {
  try {
    const client = await getClient()
    await client.SwitcherCaseManualReminderSent({ id })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: {
          generic: [error.message],
        },
      }
    }

    return { success: false }
  } finally {
    revalidatePath('/tools/switching')
  }
}

gql`
  mutation SwitcherCaseAbort($id: ID!) {
    switcher_abort(id: $id) {
      ...SwitcherCase
    }
  }
`

export async function abortSwitcherCase(id: string) {
  try {
    const client = await getClient()
    await client.SwitcherCaseAbort({ id })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        errors: {
          generic: [error.message],
        },
      }
    }

    return { success: false }
  } finally {
    revalidatePath('/tools/switching')
  }
}
