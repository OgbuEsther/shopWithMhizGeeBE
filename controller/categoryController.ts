import { NextFunction, Request, Response } from "express";
import express from "express"
import categoryModel from "../models/categoryModel";

const router = express.Router();

//get all users
router.get("/new-category", async (req: Request, res: Response) => {
 
    try {
      const { name } = req.body;
      const newCat = await categoryModel.create({
        name,
      });
  
      return res.status(201).json({
        message: "new category added",
        data: newCat,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "an error occurred while creating a category",
        data: error.message,
        err: error,
      });
    }
  
})