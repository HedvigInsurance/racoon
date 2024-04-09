import * as querystring from 'querystring'
import type { ReadonlyURLSearchParams } from 'next/navigation'
import { mergeParsedUrlQuery } from '@/utils/mergeParsedUrlQuery'

export const mergeSearchParams = (url: string, searchParams: ReadonlyURLSearchParams): string =>
  mergeParsedUrlQuery(url, querystring.parse(searchParams.toString()))
