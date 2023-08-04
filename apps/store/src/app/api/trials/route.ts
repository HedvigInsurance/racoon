import { NextResponse } from 'next/server'
import { ORIGIN_URL } from '@/utils/PageLink'

const ENDPOINT = 'https://extapi.dev.hedvigit.com/v1/trials'

const DEFAULT_BODY = {
  requestId: 'trialtest',
  trialData: {
    trialType: 'SWEDISH_GROUP_APARTMENT',
    numberCoInsured: 1,

    street: 'Fridhemsgatan 29A',
    zipCode: '11211',
    livingSpace: 38,
    subType: 'RENT',

    startDate: '2024-09-10',

    firstName: 'Robin',
    lastName: 'Hedvall',

    phoneNumber: '0730101230',
    city: 'Stockholm',
    birthDate: '1994-05-20',
  },
}

type ResponseData = {
  externalMemberId: string
  widgetUrl: string
}

export const GET = async (request: Request) => {
  const url = new URL(request.url, ORIGIN_URL)

  const apiKey = url.searchParams.get('partner')

  const fallbackURL = new URL('/debugger', ORIGIN_URL)

  if (!apiKey) {
    console.info('No partner API key provided')
    fallbackURL.searchParams.set('error', 'Partner API key missing')
    return NextResponse.redirect(fallbackURL.toString())
  }
  fallbackURL.searchParams.set('partner', apiKey)

  const ssn = url.searchParams.get('ssn')
  if (ssn) fallbackURL.searchParams.set('ssn', ssn)

  const body = {
    ...DEFAULT_BODY,
    trialData: {
      ...DEFAULT_BODY.trialData,
      email: getRandomEmailAddress(),
      ...(ssn && { personalNumber: ssn }),
    },
  }
  console.info(`Trials debugger | Email = ${body.trialData.email}`)
  console.debug('Trials debugger | Body = ', body)

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'sv-se',
      Authorization: `Basic ${btoa(`${apiKey}:`)}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    console.info(`Failed to initialize partner widget session: ${response.status}`)
    const error = (await response.json()) as { errorMessage: string }
    fallbackURL.searchParams.set('error', error.errorMessage)
    return NextResponse.redirect(fallbackURL.toString())
  }

  const data = (await response.json()) as ResponseData
  console.info(`Trials debugger | Widget URL = ${data.widgetUrl}`)

  const redirectToWidget = url.searchParams.get('destination') === 'widget'
  if (redirectToWidget) {
    console.info('Redirecting to Partner Widget')
    return NextResponse.redirect(data.widgetUrl)
  }

  const nextUrl = getInitPartnerUrl(data.widgetUrl)
  return NextResponse.redirect(nextUrl.toString())
}

const getRandomEmailAddress = () => {
  const randomId = Math.random().toString(36).substring(2, 5)
  return `sven.svensson.${randomId}@hedvig.com`
}

const getInitPartnerUrl = (widgetUrl: string): URL => {
  const url = new URL('/api/partner/init', ORIGIN_URL)
  url.search = new URL(widgetUrl).search
  url.searchParams.set('locale', 'sv-SE')
  return url
}
