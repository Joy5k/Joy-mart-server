import express from "express";
import { ProductCommentValidation } from "./productComments.validation";
import { ProductCommentController } from "./productComments.controller";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";


const router=express.Router();

router.post("/", auth(USER_ROLE.user,USER_ROLE.seller,USER_ROLE.admin,USER_ROLE.superAdmin), validateRequest(ProductCommentValidation.productCommentValidationSchema), ProductCommentController.createProductComment);

router.get("/:productId", ProductCommentController.getProductCommentsByProductId);

router.delete("/:commentId", auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), ProductCommentController.deleteProductComment);

router.put("/:commentId", auth(USER_ROLE.user, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(ProductCommentValidation.updateCommentValidaton), ProductCommentController.updateProductComment);

export const ProductCommentRoute = router;