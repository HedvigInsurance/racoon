import { setComponents } from '@storyblok/react'
import type { ReactNode } from 'react'
import { blogBlocks } from '@/features/blog/blogBlocks'
import { commonStoryblokComponents } from '@/services/storyblok/commonStoryblokComponents'

type Props = {
  children: ReactNode
}

const storyblokComponentsWithBlog = {
  ...commonStoryblokComponents,
  ...blogBlocks,
}

// Idea from storyblok/react docs: load less block components by default and provide context-specific components on demand
// https://github.com/storyblok/storyblok-react?tab=readme-ov-file#3-adding-components-per-page
export function BlogStoryblokProvider({ children }: Props) {
  setComponents(storyblokComponentsWithBlog)
  return children
}
