import { z } from "zod"

export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000, "Comment too long"),
  postId: z.string().cuid("Invalid post ID"),
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
