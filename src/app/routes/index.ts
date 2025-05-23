import { Router } from 'express';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { profileRouter } from '../modules/profile/profile.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
 
  {
    path: '/admins',
    route: AdminRoutes,
  },
 
 
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/profiles',
    route: profileRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
