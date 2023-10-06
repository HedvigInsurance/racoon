import styled from '@emotion/styled'
import { useState } from 'react'
import { Button, Text, Space, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'

export const ProductReviewCommentsBlock = () => {
  const [scoreFilter, setScoreFilter] = useState<1 | 2 | 3 | 4 | 5>(5)

  const { productData } = useProductPageContext()

  const comments = FIXTURE_REVIEW_COMMENTS[productData.name]?.comments
  if (!comments) {
    console.warn(`ProductReviewCommentsBlock | no comments found for product ${productData.name}`)

    return null
  }

  const filteredComments = comments.filter((comment) => Math.floor(comment.score) === scoreFilter)

  return (
    <GridLayout.Root>
      <GridLayout.Content
        width={{
          base: '1',
        }}
        align="center"
      >
        <Wrapper>
          <CommentsWrapper>
            {filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <Comment key={`${comment.author}:${comment.date}`} {...comment} />
              ))
            ) : (
              <div>No Comments</div>
            )}
          </CommentsWrapper>

          <StarsWrapper>
            <FilterButton variant="ghost" onClick={() => setScoreFilter(5)}>
              <Stars score={5} /> <span>(100)</span>
            </FilterButton>

            <FilterButton variant="ghost" onClick={() => setScoreFilter(4)}>
              <Stars score={4} /> <span>(0)</span>
            </FilterButton>

            <FilterButton variant="ghost" onClick={() => setScoreFilter(3)}>
              <Stars score={3} /> <span>(0)</span>
            </FilterButton>

            <FilterButton variant="ghost" onClick={() => setScoreFilter(2)}>
              <Stars score={2} /> <span>(0)</span>
            </FilterButton>

            <FilterButton variant="ghost" onClick={() => setScoreFilter(1)}>
              <Stars score={1} /> <span>(0)</span>
            </FilterButton>
          </StarsWrapper>
        </Wrapper>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

ProductReviewCommentsBlock.blockName = 'productReviewComments'

type Props = Comment

const Comment = ({ content, date, author, score }: Props) => {
  return (
    <StyledComment y={0.75}>
      <Space y={0.25}>
        <Stars style={{ '--size': '0.75rem' } as React.CSSProperties} score={score} />
        <ItalicText balance={true}>{content}</ItalicText>
      </Space>

      <Text
        size={{
          _: 'sm',
        }}
        color="textSecondaryOnGray"
      >
        {author} • {date}
      </Text>
    </StyledComment>
  )
}

const Wrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'minmax(80px, 65ch) auto',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.xxl,
})

const CommentsWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.md,
  maxHeight: '400px',
  overflowY: 'auto',
})

const StyledComment = styled(Space)({
  ':not(:first-of-type)': {
    borderTop: `1px solid ${theme.colors.gray300}`,
  },
})

const ItalicText = styled(Text)({
  fontStyle: 'italic',
})

const StarsWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.sm,
})

const Stars = styled.div<{ score: number }>(({ score }) => ({
  '--percentage': `calc(${score} / 5 * 100%)`,

  display: 'inline-block',
  lineHeight: 1,
  fontSize: `var(--size, ${theme.fontSizes.xl})`,
  fontFamily: 'Times', // make sure ★ appears correctly

  '&::before': {
    content: '"★★★★★"',
    background: `linear-gradient(
      to right,
      ${theme.colors.gray1000} var(--percentage),
      ${theme.colors.gray300} var(--percentage)
    )`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}))

const FilterButton = styled(Button)({
  display: 'inline-flex',
  alignItems: 'center',
})

type Comment = {
  content: string
  date: string
  score: number
  author: string
}

type ProductReviewComments = {
  comments: Array<Comment>
}

type ReviewComments = Record<string, ProductReviewComments | undefined>

const FIXTURE_REVIEW_COMMENTS: ReviewComments = {
  SE_HOUSE: {
    comments: [
      {
        content:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
  SE_APARTMENT_RENT: {
    comments: [
      {
        content:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        date: '2023-10-02',
        score: 5,
        author: 'John Doe',
      },
      {
        content:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
      {
        content:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        date: '2023-10-08',
        score: 5,
        author: 'John Doe',
      },
      {
        content:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        date: '2023-10-08',
        score: 5,
        author: 'John Doe',
      },
      {
        content:
          'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
        date: '2023-10-10',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
  SE_APARTMENT_BRF: {
    comments: [
      {
        content: 'Some content',
        date: '2023-10-04',
        score: 4.2,
        author: 'John Doe',
      },
    ],
  },
  SE_ACCIDENT: {
    comments: [
      {
        content: 'Some content',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
  SE_APARTMENT_STUDENT: {
    comments: [
      {
        content: 'Some content',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
  SE_CAR: {
    comments: [
      {
        content: 'Some content',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
  SE_PET_CAT: {
    comments: [
      {
        content: 'Some content',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
  SE_PET_DOG: {
    comments: [
      {
        content: 'Some content',
        date: '2023-10-04',
        score: 5,
        author: 'John Doe',
      },
    ],
  },
}
