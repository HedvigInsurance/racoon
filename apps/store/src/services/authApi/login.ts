import { datadogLogs } from '@datadog/browser-logs'
import { Observable } from 'zen-observable-ts'
import { Features } from '@/utils/Features'
import { AuthEndpoint } from './authEndpoint'
import { fetchJson, ServerError } from './fetchJson'

const POLL_INTERVAL = 1000

enum MemberLoginMethod {
  SE_BANKID = 'SE_BANKID',
}

export const loginMemberSeBankId = (ssn: string): Observable<MemberLoginStatusResponse> => {
  return new Observable((subscriber) => {
    let pollTimeoutId: number
    const poll = async (autoStartToken: string, statusUrl: string) => {
      if (subscriber.closed) return
      try {
        const result = await memberLoginStatus(statusUrl)
        subscriber.next({ ...result, seBankidAutoStartToken: autoStartToken })

        if (result.status === 'COMPLETED') {
          subscriber.complete()
        } else if (result.status === 'FAILED') {
          subscriber.error(result.statusText)
        }
      } catch (error) {
        if (error instanceof ServerError) {
          subscriber.error(error.message)
        } else {
          datadogLogs.logger.warn('LoginMemberSeBankId | Network error', {
            error,
          })
        }
      }

      pollTimeoutId = window.setTimeout(() => poll(autoStartToken, statusUrl), POLL_INTERVAL)
    }

    memberLoginCreateSE(ssn)
      .then(({ statusUrl, seBankIdProperties }) =>
        poll(seBankIdProperties.autoStartToken, AuthEndpoint.LOGIN_STATUS(statusUrl)),
      )
      .catch((err?: Error) => {
        subscriber.error(err?.message)
      })

    return () => clearTimeout(pollTimeoutId)
  })
}

export type MemberLoginStatusResponse =
  | {
      status: 'PENDING' | 'FAILED'
      statusText: string
      seBankidLiveQrCodeData?: string
      seBankidAutoStartToken?: string
    }
  | {
      status: 'COMPLETED'
      authorizationCode: string
      seBankidLiveQrCodeData?: string
      seBankidAutoStartToken?: string
    }

const memberLoginStatus = async (statusUrl: string) => {
  return await fetchJson<MemberLoginStatusResponse>(statusUrl)
}

type MemberLoginResponseSuccess = {
  result: 'success'
  id: string
  method: MemberLoginMethod
  statusUrl: string

  seBankIdProperties: {
    orderRef: string
    autoStartToken: string
  }
}

type MemberLoginResponseError = {
  result: 'error'
  reason: string
}

type MemberLoginResponse = MemberLoginResponseSuccess | MemberLoginResponseError

const memberLoginCreateSE = async (personalNumber: string) => {
  const data = await fetchJson<MemberLoginResponse>(AuthEndpoint.MEMBER_LOGIN, {
    method: 'POST',
    body: JSON.stringify({
      method: MemberLoginMethod.SE_BANKID,
      personalNumber,
    }),
  })

  if (data.result === 'error') {
    const errorMessage = Features.enabled('BANKID_V6')
      ? data.reason
      : `Failed to login: ${data.reason}`
    throw new Error(errorMessage)
  }

  return data
}
