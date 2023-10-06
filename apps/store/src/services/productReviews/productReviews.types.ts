// Data format and used keys are defined in the cloud function:
// https://console.cloud.google.com/functions/details/europe-north1/product_review_v2?env=gen2&cloudshell=false&project=hedvig-dagobah

export type AverageRating = {
  score: number
  reviewCount: number
}

export type ReviewComments = {
  count: number
  commentsByScore: Record<
    5 | 4 | 3 | 2 | 1,
    {
      total: number
      latestComments: Array<Comment>
    }
  >
}

type Comment = {
  date: string
  score: number
  content: string
  author: string
}
