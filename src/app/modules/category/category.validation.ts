import { z } from "zod";


const categoryValidation = z.object({
    body:z.object({
        categoryName: z.string().min(2).max(100),
        description: z.string().min(10).max(500).optional(),
        parentCategoryId: z.string().optional()
    })
})

export const categoryValidationSchema = {
    create: categoryValidation,
    update: categoryValidation.partial()
}   