import { Router } from "express";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { profileRouter } from "../modules/profile/profile.route";
import { ProductRoute } from "../modules/product/product.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { SubscribeRoutes } from "../modules/subscribe/subscribe.rouets";
import { bookingRoutes } from "../modules/booking/booking.route";
import { PaymentRoute } from "../modules/payment/payment.routes";
import { ReportedProductRoutes } from "../modules/reportedProduct/reportedProduct.route";
import { ProductCommentRoute } from "../modules/productComments/productComments.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },

  {
    path: "/admins",
    route: AdminRoutes,
  },

  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/profiles",
    route: profileRouter,
  },
  {
    path:"/product",
    route:ProductRoute
  },
  {
    path:"/categories",
    route:CategoryRoutes
  },
  {
    path:'/subscribe',
    route:SubscribeRoutes
  },
  {
    path:'/booking',
    route:bookingRoutes
  },
  {
    path:'/payment',
    route:PaymentRoute
  },
  {
    path:'/report',
    route:ReportedProductRoutes
  },
  {
    path:'/productComment',
    route:ProductCommentRoute
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
