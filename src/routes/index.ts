import { Router } from 'express';
import activeUserRoutes from "./activeUserRoutes";

const router = Router();

router.use('/active-user', activeUserRoutes);

export default router;