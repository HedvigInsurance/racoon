export type Score = 5 | 4 | 3 | 2 | 1

export type Review = {
  id: string
  score: number
  date: string
  content: string
}

export type ScoreDistributionTuple = [Score, number]

export type ReviewsDistribution = Array<ScoreDistributionTuple>

export type ReviewsByScore = Record<
  Score,
  {
    total: number
    reviews: Array<Review>
  }
>
