export type Review = {
  id: string
  stars: number
  text: string
  createdAt: string
  isVerified: boolean
}

export type TrustpilotData = {
  score: number
  totalReviews: number
  reviews: Array<Review>
}
