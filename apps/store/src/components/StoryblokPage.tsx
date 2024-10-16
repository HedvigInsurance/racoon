import { StoryblokComponent, useStoryblokState } from '@storyblok/react'
import { DefaultDebugDialog } from '@/components/DebugDialog/DefaultDebugDialog'
import { HeadSeoInfo } from '@/components/HeadSeoInfo/HeadSeoInfo'
import { PageBreadcrumbs } from '@/components/PageBreadcrumbs/PageBreadcrumbs'
import { BlogContext, parseBlogContext } from '@/features/blog/useBlog'
import { CompanyReviewsMetadataProvider } from '@/features/memberReviews/CompanyReviewsMetadataProvider'
import type { ReviewsMetadata } from '@/features/memberReviews/memberReviews.types'
import type { StoryblokPageProps } from '@/services/storyblok/storyblok'

type Props = StoryblokPageProps & {
  companyReviewsMetadata?: ReviewsMetadata | null
}
export const StoryblokPage = (props: Props) => {
  const story = useStoryblokState(props.story)
  if (!story) return null
  const abTestOriginStory = story.content.abTestOrigin
  // Always use robots value from the source page in A/B test cases
  const robots = story.content.robots

  return (
    <BlogContext.Provider value={parseBlogContext(props)}>
      <CompanyReviewsMetadataProvider companyReviewsMetadata={props.companyReviewsMetadata ?? null}>
        <HeadSeoInfo
          // Gotcha:  Sometimes Storyblok returns "" for PageStory pages that doesn't get 'abTestOrigin' configured
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          story={abTestOriginStory || story}
          robots={robots}
        />
        <StoryblokComponent blok={story.content} />
        {props.breadcrumbs && <PageBreadcrumbs items={props.breadcrumbs} />}
        <DefaultDebugDialog />
      </CompanyReviewsMetadataProvider>
    </BlogContext.Provider>
  )
}
