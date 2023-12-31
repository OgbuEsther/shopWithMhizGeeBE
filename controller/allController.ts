
import productModels from "../models/productModels";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary";
import UserModel from "../models/UserModel";
const router = express.Router();

//get all users

router.get("/users", async (req: Request, res: Response) => {
  try {
    const fetchUser = await UserModel.find();
    return res.status(200).json({
      message: "success",
      data: fetchUser,
    });
  } catch (err) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

// register a user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const createUser = await UserModel.create({
      name,
      email,
      password,
    });
    return res.status(200).json({
      message: "success",
      data: createUser,
    });
  } catch (err) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const createUser = await UserModel.create({
      name,
      email,
      password,
      isAdmin: false,
    });
    return res.status(200).json({
      message: "success",
      data: createUser,
    });
  } catch (err) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const checkUser = await UserModel.findOne({ email: email });

    if (checkUser) {
      return res.status(200).json({
        message: "success",
        data: checkUser,
      });
    } else {
      return res.status(200).json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

// create product

router.post("/createProduct", async (req: Request, res: Response) => {
  try {
    const { title, desc, price, uploadProducConfig, quantity, status } = req.body;
    const imgUploader = await cloudinary.uploader.upload(req?.file!.path);
    const creating = await productModels.create({
      title,
      desc,
      price,
      uploadProducConfig :imgUploader?.secure_url,
      quantity,
      status: true,
    });

    res.status(200).json({
      message: "successfully created",
      data: creating,
    });
  } catch (err) {
    res.status(404).json({
      message: "an error occured",
    });
  }
});

//purchasing product
router.patch(
  "/purchaseProduct/:productID",
  async (req: Request, res: Response) => {
    try {
      const { qty } = req.body;

      // const getUser = await UserModel.findById(req.params.userID);
      const getProducts = await productModels.findById(req.params.productID);

      if (getProducts!.quantity == 0) {
        await productModels.findByIdAndUpdate(getProducts!._id!, {
          status: false,
        });
      } else {
        await productModels.findByIdAndUpdate(getProducts!._id!, {
          quantity: getProducts?.quantity! - qty,
        });
      }
    } catch (err) {
      res.status(404).json({
        message: "an error occured",
      });
    }
  }
);

//get all products

router.get("/allproducts", async (req: Request, res: Response) => {
  try {
    const getProducts = await productModels.find();

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
