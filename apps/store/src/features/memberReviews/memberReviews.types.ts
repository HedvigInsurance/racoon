export type Score = 5 | 4 | 3 | 2 | 1

export type Rating = {
  score: number
  totalOfReviews: number
}

export type Review = {
  id: string
  type: 'company' | 'product'
  score: number
  date: string
  content: string
}

export type ScoreDistributionTuple = [Score, number]

export type ReviewsDistribution = Array<ScoreDistributionTuple>
