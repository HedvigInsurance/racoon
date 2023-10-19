import { z } from 'zod'
import { reviewCommentsSchema, averageRatingSchema } from './productReviews.utils'

// Data format and used keys are defined in the cloud function:
// https://console.cloud.google.com/functions/details/europe-north1/product_review_v2?env=gen2&cloudshell=false&project=hedvig-dagobah
export type ReviewComments = z.infer<typeof reviewCommentsSchema>

export type AverageRating = z.infer<typeof averageRatingSchema>
