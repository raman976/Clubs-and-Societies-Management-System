import express from "express";
import { addImage, getGallery} from "../controllers/clubController.js";


const router = express.Router();

router.get("/gallery", addImage);
router.post("/gallery", getGallery);



export default router;
