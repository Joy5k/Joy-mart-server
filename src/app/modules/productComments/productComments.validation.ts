import { z } from "zod";


const productCommentValidationSchema=z.object({
    body:z.object({
        productId:z.string().min(1).max(24),
        rating:z.number().min(1).max(5),
        comment:z.string().min(1).max(1500)
    }),
})

const updateCommentValidaton=z.object({
    body:z.object({
        productId:z.string().min(1).max(24).optional(),
        rating:z.number().min(1).max(5).optional(),
        comment:z.string().max(1500).optional()
    }),
})
export const ProductCommentValidation = {
    productCommentValidationSchema,
    updateCommentValidaton

}