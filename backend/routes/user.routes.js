import express from 'express';
import { getUser,getUsers, updateUser } from '../controllers/user.controllers.js';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/fileUpload.js';

let router = express.Router();

router.get("/", auth, getUsers)
router.get("/:id", auth, getUser)
router.put("/:id", auth, upload.single("displayPicture"), updateUser)




export default router;