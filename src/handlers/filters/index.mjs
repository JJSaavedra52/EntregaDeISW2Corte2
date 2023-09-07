import {Router} from "express";
import applyFiltersHandler from "./applyFiltersHandler.mjs";

const router = Router();

router.get("/", (req, res) => {
    res.send("ok images GET")
})

router.post("/", applyFiltersHandler);

export default router;