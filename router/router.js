import { Router } from "express";

const router = Router();

router.route('/').get((req,res)=>{
    res.send("heigeh")
})

export default router;