import { Router } from "express";
import { generateProduct } from "../controllers/mocking.controller.js";

export const mockingRouter = Router();

mockingRouter.get("/mocking", (req, res) => {
    const response = generateProduct();
    res.json(response);
});
