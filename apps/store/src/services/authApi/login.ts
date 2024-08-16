import { datadogLogs } from '@datadog/browser-logs'
import { Observable } from 'zen-observable-ts'
import type { RoutingLocale } from '@/utils/l10n/types'
import { AuthEndpoint } from './authEndpoint'
import { fetchJson, ServerError } from './fetchJson'

const POLL_INTERVAL = 1000

enum MemberLoginMethod {
  SE_BANKID = 'SE_BANKID',
}

export const loginMemberSeBankId = (
  ssn: string | null,
  locale?: RoutingLocale,
): Observable<MemberLoginStatusResponse> => {
  return new Observable((subscriber) => {
    let pollTimeoutId: number
    const poll = async (statusUrl: string) => {
      if (subscriber.closed) return
      try {
        const result = await memberLoginStatus(statusUrl, locale)
        subscriber.next(result)

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

      pollTimeoutId = window.setTimeout(() => poll(statusUrl), POLL_INTERVAL)
    }

    memberLoginCreateSE(ssn, locale)
      .then(({ statusUrl }) => poll(AuthEndpoint.LOGIN_STATUS(statusUrl)))
      .catch((err?: Error) => {
        subscriber.error(err?.message)
      })

    return () => clearTimeout(pollTimeoutId)
  })
}

type SeBankIdProperties = {
  orderRef: string
  autoStartToken: string
  liveQrCodeData: string
  bankidAppOpened: boolean
}

export type MemberLoginStatusResponse = {
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  statusText: string
  seBankIdProperties: SeBankIdProperties
  authorizationCode: string | null
}

const memberLoginStatus = async (statusUrl: string, locale?: RoutingLocale) => {
  return await fetchJson<MemberLoginStatusResponse>(statusUrl, { locale })
}

type MemberLoginResponseSuccess = {
  result: 'success'
  id: string
  method: MemberLoginMethod
  statusUrl: string
  seBankIdProperties: SeBankIdProperties
}

type MemberLoginResponseError = {
  result: 'error'
  reason: string
}

type MemberLoginResponse = MemberLoginResponseSuccess | MemberLoginResponseError

const memberLoginCreateSE = async (personalNumber: string | null, locale?: RoutingLocale) => {
  const data = await fetchJson<MemberLoginResponse>(AuthEndpoint.MEMBER_LOGIN, {
    method: 'POST',
    body: JSON.stringify({
      method: MemberLoginMethod.SE_BANKID,
      personalNumber,
    }),
    locale,
  })

  if (data.result === 'error') {
    const errorMessage = data.reason
    throw new Error(errorMessage)
  }

  return data
}
