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
    // console.log(req.body);

    // console.log(req.files);
    console.log(req.file);

    const user = await userInstance.updateUser(id, req);
    console.log(user);

    if (!user) {
        let err = new Error("User not found")
        err.statusCode = 404
        throw err;
    }
    res.status(200).json(user);
})

export const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    let user = await userInstance.findUserById(id)
    console.log(user);

    if (!user) {
        let err = new Error("User not found")
        err.statusCode = 404
        throw err;
    }
    res.status(200).json(user)
})