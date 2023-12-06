import { Router } from "express";
import { authRouter } from "../routers/auth.router.js";
import { usersRouter } from "../routers/users.router.js";
import { productRouter } from "./products.router.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/products', productRouter)
export { apiRouter };