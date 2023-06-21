import { ORIGIN_URL } from '@/utils/PageLink'

type Parameter = [param: string, value: string]

export const getParameterizedLink = (link: string, parameters: Array<Parameter>) => {
  return parameters.reduce((result, [param, value]) => {
    return addSearchParam(result, param, value)
  }, link)
}

const addSearchParam = (url: string, param: string, value: string) => {
  const urlObj = new URL(url, ORIGIN_URL)
  urlObj.searchParams.set(param, value)
  return urlObj.toString()
}
