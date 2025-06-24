import { z } from "zod";
const isValidMongoId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val);


const createProductValidation=z.object({
            body: z.object({
                title:z.string({
                    required_error: "Product title is required",
                }).min(1, "Product title cannot be empty"),
                shortTitle: z.string().optional(),
                description: z.string({
                    required_error: "Product description is required",
                }).min(1, "Product description cannot be empty"),
                shortDescription: z.string().optional(),
                price: z.number({
                    required_error: "Product price is required",
                }).min(0, "Product price cannot be negative"),
                originalPrice: z.number().optional().default(0),
                discountPercentage: z.number().optional().default(0),
                costPrice: z.number().optional().default(0),
                stock: z.number({
                    required_error: "Product stock is required",
                }).min(0, "Product stock cannot be negative"),
                lowStockThreshold: z.number().optional().default(5),
                weight: z.number().optional().default(0),
                dimensions: z.object({
                    length: z.number().optional().default(0),
                    width: z.number().optional().default(0),
                    height: z.number().optional().default(0),
                }).optional(),
               category: z.string({
            required_error: "Product category ID is required",
        })
            .min(1, "Category ID cannot be empty")
            .refine((val) => isValidMongoId(val), {
                message: "Category ID must be a valid MongoDB ID",
            }),
                images: z.array(z.string()).nonempty("At least one image is required"),
                thumbnail: z.string().optional(),
                videoUrl: z.string().optional(),
                attributes: z.record(z.string()).optional(),
                featured: z.boolean().optional().default(false),
                rating: z.object({
                    average: z.number().optional().default(0),
                    count: z.number().optional().default(0),
                }).optional(),
                shipping: z.object({
                    free: z.boolean().optional().default(false),
                    processingTime: z.string().optional().default("1-2 business days"),
                }).optional(),
                isDeleted: z.boolean().optional().default(false),
                isActive: z.boolean().optional().default(true), 
            })
})

const updateProductValidation = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        shortTitle: z.string().optional(),
        description: z.string().min(1).optional(),
        shortDescription: z.string().optional(),
        price: z.number().min(0).optional(),
        originalPrice: z.number().min(0).optional(),
        discountPercentage: z.number().min(0).optional(),
        costPrice: z.number().min(0).optional(),
        stock: z.number().min(0).optional(),
        lowStockThreshold: z.number().min(0).optional(),
        weight: z.number().min(0).optional(),
        dimensions: z.object({
            length: z.number().min(0).optional(),
            width: z.number().min(0).optional(),
            height: z.number().min(0).optional(),
        }).optional(),
category: z.string({
            required_error: "Product category ID is required",
        })
            .min(1, "Category ID cannot be empty")
            .refine((val) => isValidMongoId(val), {
                message: "Category ID must be a valid MongoDB ID",
            }).optional(),
                    images: z.array(z.string()).optional(),
        thumbnail: z.string().optional(),
        videoUrl: z.string().optional(),
        attributes: z.record(z.string()).optional(),
        featured: z.boolean().optional(),
        rating: z.object({
            average: z.number().min(0).optional(),
            count: z.number().min(0).optional(),
        }).optional(),
        shipping: z.object({
            free: z.boolean().optional(),
            processingTime: z.string().optional(),
        }).optional(),
        isDeleted: z.boolean().optional(),
        isActive: z.boolean().optional(),
    })
})


export const ProductValidation = {
    createProduct: createProductValidation,
    updateProduct: updateProductValidation,
};  