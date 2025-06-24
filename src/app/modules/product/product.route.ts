import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidation } from "./product.validation";
import { ProductController } from "./product.controller";

const route = express.Router();

route.post("/create",auth(USER_ROLE.admin, USER_ROLE.superAdmin,USER_ROLE.seller), validateRequest(ProductValidation.createProduct),ProductController.createProductIntoDB);
route.put("/update/:productId",auth(USER_ROLE.admin, USER_ROLE.superAdmin,USER_ROLE.seller), validateRequest(ProductValidation.updateProduct),ProductController.updateProductInDB);
route.delete("/delete/:productId",auth(USER_ROLE.admin, USER_ROLE.superAdmin,USER_ROLE.seller), ProductController.deleteProductFromDB);
route.get("/getSingle-product/:productId", ProductController.getProductById);
route.get("/get-all-products", ProductController.getAllProducts);


export const ProductRoute = route;
