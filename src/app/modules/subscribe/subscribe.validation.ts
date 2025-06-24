import { z } from "zod";

const subscribeValidationSchema=z.object({
    body:z.object({
        email: z.string(),

    })
})

export const subscribeValidation={
    create:subscribeValidationSchema
}