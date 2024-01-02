import { z } from 'zod'
import { reviewCommentsSchema, averageRatingSchema, commentSchema } from './productReviews.utils'

export type Score = '5' | '4' | '3' | '2' | '1'

export type ScoreDistributionTuple = [Score, number]

export type ReviewsDistribution = Array<ScoreDistributionTuple>

// Data format and used keys are defined in the cloud function:
// https://console.cloud.google.com/functions/details/europe-north1/product_review_v2?env=gen2&cloudshell=false&project=hedvig-dagobah
export type ReviewComments = z.infer<typeof reviewCommentsSchema>

export type AverageRating = z.infer<typeof averageRatingSchema>

export type Comment = z.infer<typeof commentSchema>
