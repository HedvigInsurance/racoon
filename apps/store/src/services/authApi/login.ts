import { datadogLogs } from '@datadog/browser-logs'
import { Observable } from 'zen-observable-ts'
import { AuthEndpoint } from './authEndpoint'
import { fetchJson, ServerError } from './fetchJson'

const POLL_INTERVAL = 1000

enum MemberLoginMethod {
  SE_BANKID = 'SE_BANKID',
}

export const loginMemberSeBankId = (ssn: string): Observable<MemberLoginStatusResponse> => {
  return new Observable((subscriber) => {
    let pollTimeoutId: number
    const poll = async (statusUrl: string) => {
      if (subscriber.closed) return
      try {
        const result = await memberLoginStatus(statusUrl)
        subscriber.next(result)

        if (result.status === 'COMPLETED') {
          subscriber.complete()
        } else if (result.status === 'FAILED') {
          subscriber.error(new Error('Login failed: ' + result.statusText))
        }
      } catch (error) {
        if (error instanceof ServerError) {
          subscriber.error(error)
        } else {
          datadogLogs.logger.warn('LoginMemberSeBankId | Network error', {
            error: (error as Error).message,
          })
        }
      }

      if (subscriber.closed) return
      pollTimeoutId = window.setTimeout(() => poll(statusUrl), POLL_INTERVAL)
    }

    memberLoginCreateSE(ssn)
      .then(({ statusUrl }) => poll(AuthEndpoint.LOGIN_STATUS(statusUrl)))
      .catch((err) => subscriber.error(err))

    return () => clearTimeout(pollTimeoutId)
  })
}

export type MemberLoginStatusResponse =
  | {
      status: 'PENDING' | 'FAILED'
      statusText: string
    }
  | {
      status: 'COMPLETED'
      authorizationCode: string
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
    throw new Error('Failed to login: ' + data.reason)
  }

  return data
}
