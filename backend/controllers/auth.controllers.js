import authInstance from '../services/auth.services.js'
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';

export let register = asyncHandler(async (req, res, next) => {
    let newUser = await authInstance.registerUser(req);
    if (!newUser) {
        let err = new Error("User is not registered!!")
        err.statusCode = 400
        throw err;
    }
    let token = await generateToken(newUser._id)
    if (!token) {
        let err = new Error("Token is not generated!!")
        err.statusCode = 400
        throw err;
    }
    res.status(201).json({ user: newUser, token })
})

export let login = asyncHandler(async (req, res, next) => {
    let { password } = req.body
    let exisitingUser = await authInstance.loginUser(req);
    console.log(await exisitingUser.comparePassword(password, exisitingUser.password));

    if (!exisitingUser || !(await exisitingUser.comparePassword(password, exisitingUser.password))) {
        let err = new Error("Invalid email or password")
        err.statusCode = 400
        throw err;
    }
    let token = await generateToken(exisitingUser._id)
    res.status(200).json({ user: exisitingUser, token })
})