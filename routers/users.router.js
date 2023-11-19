require("dotenv").config();

const express = require("express");
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlwares/need-signin.middlware.js');
const signInCheck = require('../middlwares/siginInCheck.middleware.js');
const { Users } = require("../models");
const router = express.Router();


//회원가입
router.post("/users", signInCheck, async (req, res, next) => {
    const { email, password, name } = req.body;
    try {
        const users = await Users.findOne({ where: { email } });
        if (users) {
            res.status(400).json({
                errorMessage: "이미 가입된 회원입니다",
            });
        } else {
            const user = new Users({ email, password, name });
            await user.save();

            const userWithoutPassword = {
                id: user.id,
                email: user.email,
                name: user.name,
                updatedAt: user.updatedAt,
                createdAt: user.createdAt
            };

            res.status(201).json({ user: userWithoutPassword });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({
            errorMessage: "데이터 형식이 잘못되었습니다."
        })
    }
})

router.get('/users/me', authMiddleware, async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { id, email, name } = user;
        res.json({ id, email, name });
    } catch (err) {
        res.json({ id, email, name });
    }
})

module.exports = router