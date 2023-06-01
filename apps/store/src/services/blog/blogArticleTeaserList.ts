import { atom, useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { BlogArticleTeaser } from './articleTeaser'

type BlogArticleTeaserList = Array<BlogArticleTeaser>

const BLOG_ARTICLE_TEASERS_ATOM = atom<BlogArticleTeaserList>([])

export const useBlogArticleTeaserList = (): BlogArticleTeaserList => {
  return useAtomValue(BLOG_ARTICLE_TEASERS_ATOM)
}

export const useHydrateBlogArticleTeaserList = (value: BlogArticleTeaserList) => {
  useHydrateAtoms([[BLOG_ARTICLE_TEASERS_ATOM, value]])
}
