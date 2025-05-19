import { Router } from 'express';
import activeUserRoutes from "./activeUserRoutes";

const router = Router();

router.use('/active-user', activeUserRoutes);
router.get('/fu-chan', (res, req) => { console.log("yamaneko");});

export default router;
