
import productModels from "../models/productModels";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import cloudinary from "../utils/cloudinary";
import { uploadProducConfig } from "../utils/multer";
// create product

router.post("/new-product",uploadProducConfig, async (req: Request, res: Response) => {
  try {
    const { title, price, productImage, quantity, status } = req.body;
    const imgUploader = await cloudinary.uploader.upload(req?.file!.path);
    const creating = await productModels.create({
      title,
      price,
      productImage :imgUploader?.secure_url,
      quantity,
      status: true,
    });

    return res.status(201).json({
      message: "Product successfully created",
      data: creating,
    });
  } catch (error:any) {
    return res.status(400).json({
      message: "unable to create product",
      data: error,
      errMsg : error.message
    });
  }
});

//purchasing product

router.patch(
  "/purchase/:productID",
  async (req: Request, res: Response) => {
    try {
      const { qty } = req.body;

      const getProducts = await productModels.findById(req.params.productID);

      if (getProducts!.quantity == 0) {
        await productModels.findByIdAndUpdate(getProducts!._id, {
          status: false,
        },{new:true});
      } else {
        await productModels.findByIdAndUpdate(getProducts!._id, {
          quantity: getProducts?.quantity! - qty,
        },{new:true});

        return res.status(200).json({
          message : "added to cart",
          data : qty,
          result : getProducts?.quantity! - qty
        })
      }
    } catch (error) {
      res.status(404).json({
        message: "an error occured",
      });
    }
  }
);



//get all products

router.get("/allproducts", async (req: Request, res: Response) => {
  try {
    const getProducts = await productModels.find().sort({createdAt : -1});

    return res.status(200).json({
      messsage: "gotten all products",
      data: getProducts,
    });
  } catch (error) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

router.get("/allproducts/:id", async (req: Request, res: Response) => {
  try {
    const getProducts = await productModels.findById(req.params.id);

    return res.status(200).json({
      messsage: "gotten all products",
      data: getProducts,
    });
  } catch (error) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

export default router;
