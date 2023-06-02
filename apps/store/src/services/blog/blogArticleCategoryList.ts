import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'

type BlogArticleCategory = {
  id: string
  name: string
  href: string
}

export type BlogArticleCategoryList = Array<BlogArticleCategory>

const ATOM = atom<BlogArticleCategoryList>([])

export const useBlogArticleCategoryList = (): BlogArticleCategoryList => {
  return useAtomValue(ATOM)
}

export const useHydrateBlogArticleCategoryList = (value: BlogArticleCategoryList) => {
  useHydrateAtoms([[ATOM, value]])
}
