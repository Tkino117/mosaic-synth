import { Router } from 'express';

const router = Router();

router.get('/', function (req, res) {
    console.log("GET /api/active-user/");
});
router.get('/number/',  function (req, res) {
    console.log("GET /api/active-user/number");
});

export default router;