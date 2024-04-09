import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server'
import {
  fetchCompanyReviewsByScore,
  fetchProductReviewsByScore,
} from '@/features/memberReviews/memberReviews'
import type { ReviewsByScore, Review, Score } from '@/features/memberReviews/memberReviews.types'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const productIds = searchParams.getAll('productId')

    let reviews: ReviewsByScore | null = null
    if (productIds.length === 0) {
      reviews = await fetchCompanyReviewsByScore()
    } else {
      reviews = await aggregateProductReviewsByScore(productIds)
    }

    if (reviews === null) {
      return NextResponse.json(null, { status: 204 })
    }

    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch reviews', error)
    return NextResponse.json(null, { status: 500 })
  }
}

async function aggregateProductReviewsByScore(
  productIds: Array<string>,
): Promise<ReviewsByScore | null> {
  const productReviewsByScoreList = await Promise.all(
    productIds.map((id) => fetchProductReviewsByScore(id)),
  )
  const filteredProductReviewsByScoreList = productReviewsByScoreList.filter(
    (review): review is ReviewsByScore => review !== null,
  )

  const maxReviewsPerScore = 10
  const scores: Array<Score> = [5, 4, 3, 2, 1]
  const result: ReviewsByScore = {
    5: { total: 0, reviews: [] },
    4: { total: 0, reviews: [] },
    3: { total: 0, reviews: [] },
    2: { total: 0, reviews: [] },
    1: { total: 0, reviews: [] },
  }
  scores.forEach((score) => {
    filteredProductReviewsByScoreList.forEach((reviewsByScore) => {
      result[score].total += reviewsByScore[score].total
      result[score].reviews.push(...reviewsByScore[score].reviews)
    })

    result[score].reviews.sort(sortReviewsByDate).splice(maxReviewsPerScore)
  })

  return result
}

function sortReviewsByDate(a: Review, b: Review) {
  const dateA = new Date(a.date).getTime()
  const dateB = new Date(b.date).getTime()

  return dateB - dateA
}
