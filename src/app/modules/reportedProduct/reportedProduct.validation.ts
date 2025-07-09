import { z } from "zod";

const createReportedProductValidation = z.object({
    body:z.object({
        productId:z.string(),
        reason:z.string().min(2).max(1000)
    })
})

export const ReportedProductValidation = {
    createReportedProductValidation
}