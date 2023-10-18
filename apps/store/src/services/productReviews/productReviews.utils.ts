import { z } from 'zod'

export const averageRatingSchema = z.object({
  score: z.number(),
  reviewCount: z.number(),
})

const commentSchema = z.object({
  date: z.string(),
  score: z.number(),
  content: z.string(),
  author: z.string(),
})

const commentsByScoreSchema = z.object({
  total: z.number(),
  latestComments: z.array(commentSchema),
})

export const reviewCommentsSchema = z.object({
  commentsByScore: z.object({
    '5': commentsByScoreSchema,
    '4': commentsByScoreSchema,
    '3': commentsByScoreSchema,
    '2': commentsByScoreSchema,
    '1': commentsByScoreSchema,
  }),
})

export const validateProductAverageRating = (data: unknown) => {
  return averageRatingSchema.safeParse(data)
}

export const validateProductReviewsComments = (data: unknown) => {
  return reviewCommentsSchema.safeParse(data)
}
