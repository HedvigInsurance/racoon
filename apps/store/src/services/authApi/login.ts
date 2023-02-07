import { AuthEndpoint } from './authEndpoint'
import { fetchJson } from './fetchJson'

enum MemberLoginMethod {
  SE_BANKID = 'SE_BANKID',
}

type StatusChangeCallback = (status: MemberLoginStatusResponse['status']) => void

export const loginMemberSeBankId = async (ssn: string, onStatusChange: StatusChangeCallback) => {
  const { statusUrl } = await memberLoginCreateSE(ssn)
  return await memberLoginStatusPoll(AuthEndpoint.LOGIN_STATUS(statusUrl), onStatusChange)
}

type MemberLoginStatusResponse =
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

const memberLoginStatusPoll = async (
  statusUrl: string,
  onStatusChange: StatusChangeCallback,
): Promise<string> => {
  const result = await memberLoginStatus(statusUrl)
  onStatusChange(result.status)

  if (result.status === 'COMPLETED') {
    return result.authorizationCode
  }

  if (result.status === 'FAILED') {
    throw new Error('Login failed: ' + result.statusText)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(memberLoginStatusPoll(statusUrl, onStatusChange))
    }, 1000)
  })
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
