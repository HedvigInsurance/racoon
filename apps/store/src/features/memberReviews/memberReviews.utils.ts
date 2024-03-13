import { z } from 'zod'

export const averageRatingSchema = z.object({
  score: z.number(),
  reviewCount: z.number(),
})

export const reviewSchema = z.object({
  id: z.string(),
  date: z.string(),
  score: z.number(),
  content: z.string(),
  author: z.string(),
  attributedTo: z.string(),
})

const commentByScoreValueSchema = z.object({
  total: z.number(),
  latestComments: z.array(reviewSchema),
})

export const commentByScoreSchema = z.object({
  5: commentByScoreValueSchema,
  4: commentByScoreValueSchema,
  3: commentByScoreValueSchema,
  2: commentByScoreValueSchema,
  1: commentByScoreValueSchema,
})

export const reviewCommentsSchema = z.object({
  tag: z.string(),
  commentsByScore: commentByScoreSchema,
})

export const validateAverageRating = (data: unknown) => {
  return averageRatingSchema.safeParse(data)
}

export const validateLatestReviews = (data: unknown) => {
  return commentByScoreSchema.safeParse(data)
}

export const validateProductReviewsComments = (data: unknown) => {
  return reviewCommentsSchema.safeParse(data)
}
