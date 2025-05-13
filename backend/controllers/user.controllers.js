import asyncHandler from "express-async-handler";
import userInstance from "../services/user.services.js";

export const getUsers = asyncHandler(async (req, res, next) => {
    const users = await userInstance.findAllUsers()
    if (!users) {
        let err = new Error("Users not found")
        err.statusCode = 404
        throw err;
    }
    res.status(200).json(users)
})

export const updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const user = await userInstance.updateUser(id, req);
    console.log(user);
    
    if (!user) {
        let err = new Error("User not found")
        err.statusCode = 404
        throw err;
    }
    res.status(200).json(user);
})