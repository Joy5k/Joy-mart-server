import { z } from "zod";


const categoryValidation = z.object({
    body:z.object({
        categoryName: z.string().min(2).max(100),
        isActive:z.boolean().default(true),
        description: z.string().max(500).optional(),
    })
})
const updateCategoryValidation = z.object({
    body:z.object({
        categoryName: z.string().min(2).max(100).optional(),
        isActive:z.boolean().default(true).optional(),
        description: z.string().max(500).optional(),
    })
})



export const categoryValidationSchema = {
    create: categoryValidation,
    update:updateCategoryValidation
}   