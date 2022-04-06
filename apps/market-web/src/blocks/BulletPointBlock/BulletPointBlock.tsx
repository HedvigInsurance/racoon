import styled from '@emotion/styled'
import { mq } from 'ui'
import { DeferredImage } from '@/components/DeferredImage'
import { FontSizes, Heading } from '@/components/Heading/Heading'
import { getStoryblokImage } from '@/services/storyblok/storyblok'
import {
  ImageUrl,
  MarkdownHtmlComponent,
  MinimalColorComponent,
  StoryblokBaseBlock,
} from '@/services/storyblok/types'
import { SectionWrapper, getMinimalColorStyles, ContentWrapper } from '../blockHelpers'

const BulletPointSectionWrapper = styled(SectionWrapper)({
  overflowX: 'hidden',
})

const InnerWrapper = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  minWidth: '100%',

  [mq.xs]: {
    marginLeft: '-1.5rem',
  },

  [mq.lg]: {
    marginLeft: '-3.5rem',
  },
})

const BulletPointTitle = styled(Heading)({
  marginBottom: '1rem',
})

const BulletPoint = styled.div<{
  alignCenter: boolean
  bulletPointLayout: boolean
  columns: number
}>(({ alignCenter, bulletPointLayout, columns }) => ({
  display: 'flex',
  flexDirection: bulletPointLayout ? 'row' : 'column',
  width: '100%',
  marginTop: '1.25rem',
  marginBottom: '1.25rem',

  ...(alignCenter && {
    alignItems: 'center',
    textAlign: 'center',
  }),

  [mq.xs]: {
    flexDirection: 'column',
    width: 'calc(50% - 1.5rem)',
    marginLeft: '1.5rem',
  },

  [mq.md]: {
    ...(columns === 3 && {
      width: 'calc((1 / 3 * 100%) - 1.5rem)',
    }),
  },

  [mq.lg]: {
    width: `calc((1 / ${columns} * 100%) - 3.5rem)`,
    marginLeft: '3.5rem',
  },
}))

const BulletPointHeader = styled.div<{
  bulletPointLayout: boolean
}>(({ bulletPointLayout }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: '0',
  marginBottom: '1.5rem',

  ...(bulletPointLayout && {
    justifyContent: 'flex-start',
    maxWidth: '2rem',
    maxHeight: '2rem',
    marginRight: '1.5rem',

    [mq.xs]: {
      maxWidth: 'none',
      maxHeight: 'none',
      width: 'auto',
      marginRight: '0',
    },
  }),
}))

const BulletPointImage = styled(DeferredImage)({
  width: 'auto',
})

const BulletPointBody = styled.div<{
  alignCenter: boolean
  colorComponent: MinimalColorComponent
}>(({ alignCenter, colorComponent }) => ({
  maxWidth: alignCenter ? '16rem' : 'none',
  marginLeft: 'auto',
  marginRight: 'auto',
  color: getMinimalColorStyles(colorComponent?.color ?? 'standard').color,
  fontSize: '1rem',

  '& > *': {
    margin: '0 auto 1rem',
  },

  [mq.lg]: {
    fontSize: '1.125rem',
  },
}))

type BulletPointItemProps = ReadonlyArray<
  Omit<StoryblokBaseBlock, 'component'> & {
    image: ImageUrl
    title?: string
    title_size: FontSizes
    title_size_mobile?: FontSizes
    paragraph: MarkdownHtmlComponent
  }
>

export type BulletPointBlockProps = StoryblokBaseBlock & {
  align_center: boolean
  bullet_point_layout: boolean
  color_body: MinimalColorComponent
  bullet_points: BulletPointItemProps
}

export const BulletPointBlock = ({
  align_center,
  bullet_point_layout,
  extra_styling,
  color,
  color_body,
  size,
  bullet_points,
}: BulletPointBlockProps) => (
  <BulletPointSectionWrapper colorComponent={color} size={size} extraStyling={extra_styling}>
    <ContentWrapper contentWidth>
      <InnerWrapper>
        {bullet_points.map((bullet) => (
          <BulletPoint
            key={bullet._uid}
            alignCenter={align_center}
            bulletPointLayout={bullet_point_layout}
            columns={bullet_points.length}
          >
            {bullet.image && (
              <BulletPointHeader bulletPointLayout={bullet_point_layout}>
                <BulletPointImage src={getStoryblokImage(bullet.image)} />
              </BulletPointHeader>
            )}
            <div>
              {bullet.title && (
                <BulletPointTitle
                  as="h3"
                  size={bullet.title_size}
                  mobileSize={bullet.title_size_mobile || 'sm'}
                >
                  {bullet.title}
                </BulletPointTitle>
              )}
              {bullet.paragraph && (
                <BulletPointBody
                  alignCenter={align_center}
                  colorComponent={color_body}
                  dangerouslySetInnerHTML={{
                    __html: bullet.paragraph?.html,
                  }}
                />
              )}
            </div>
          </BulletPoint>
        ))}
      </InnerWrapper>
    </ContentWrapper>
  </BulletPointSectionWrapper>
)
