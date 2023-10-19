import styled from '@emotion/styled'
import { useState, useMemo, ChangeEventHandler } from 'react'
import { Text, Space, Badge, theme } from 'ui'
import { GridLayout } from '@/components/GridLayout/GridLayout'
import { InputSelect, type InputSelectProps } from '@/components/InputSelect/InputSelect'
import { useProductPageContext } from '@/components/ProductPage/ProductPageContext'
import { ProductRating } from '@/components/ProductRating/ProductRating'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'

const MAX_SCORE = 5
const FILLED_STAR = '★'
const UNFILLED_STAR = '☆'

type InputOptions = Array<InputSelectProps['options'][number]>

type AvailableScore = '5' | '4' | '3' | '2' | '1'

export const ProductReviewCommentsBlock = () => {
  const { reviewComments } = useProductPageContext()
  const [selectedScore, setSelectedScore] = useState<AvailableScore>('5')

  const filterOptions = useMemo<InputOptions>(() => {
    if (!reviewComments) return []

    const availableScores: Array<AvailableScore> = ['5', '4', '3', '2', '1']
    const options = availableScores.map<InputOptions[number]>((score) => {
      const commentsByScore = reviewComments.commentsByScore[score]
      return {
        name: getScoreFilterOptionName(score, commentsByScore.total),
        value: score,
        disabled: commentsByScore.total === 0,
      }
    })

    return options
  }, [reviewComments])

  if (!reviewComments) {
    // We already log the absence of reviews during build
    return null
  }

  const handleFilterChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setSelectedScore(event.target.value as AvailableScore)
  }

  return (
    <GridLayout.Root>
      <GridLayout.Content
        width={{
          base: '1',
        }}
      >
        <Space y={2}>
          <SpaceFlex direction="horizontal" align="center" space={1} wrap="wrap">
            <InputSelect
              name="product-review-filter-by-score"
              options={filterOptions}
              value={selectedScore}
              onChange={handleFilterChange}
            />

            {/* TODO: Lokalise this */}
            <Text color="textSecondary">Showing our latest reviews</Text>
          </SpaceFlex>

          {/* Key here is used to reset horizontal scroll */}
          <CommentsList key={selectedScore}>
            {reviewComments.commentsByScore[selectedScore].latestComments.map((comment, index) => (
              <Comment key={`${comment.date}:${index}`} {...comment} />
            ))}
          </CommentsList>
        </Space>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

ProductReviewCommentsBlock.blockName = 'productReviewComments'

type CommentProps = {
  score: number
  date: string
  author: string
  content: string
}

const Comment = ({ content, date, author, score }: CommentProps) => {
  return (
    <CommentWrapper>
      <ProductRating score={score} />
      <Content>
        <Text balance={true}>{content}</Text>
      </Content>
      <Footer>
        <Text
          size={{
            _: 'sm',
          }}
          color="textSecondaryOnGray"
        >
          {author}
        </Text>
        <Badge color="blueFill2">{date}</Badge>
      </Footer>
    </CommentWrapper>
  )
}

const CommentsList = styled.div({
  display: 'flex',
  gap: theme.space.md,
  overflowX: 'auto',
  // Breathing room between scroll bar and comments
  paddingBottom: theme.space.md,
})

const CommentWrapper = styled.div({
  flex: '0 0 auto',

  display: 'inline-flex',
  flexDirection: 'column',
  gap: theme.space.md,
  padding: theme.space.md,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.gray200,
  width: '16.25rem',
  aspectRatio: '1/1',
})

const Content = styled.div({
  flex: '1 0',
})

const Footer = styled.footer({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const getScoreFilterOptionName = (score: AvailableScore, count: number) => {
  const numberUnfilledStars = MAX_SCORE - Number(score)
  const numberFilledStars = MAX_SCORE - numberUnfilledStars

  return (
    FILLED_STAR.repeat(numberFilledStars) +
    UNFILLED_STAR.repeat(numberUnfilledStars) +
    ` (${count})`
  )
}
