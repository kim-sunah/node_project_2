require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const router = express.Router();
const bcrypt = require("bcryptjs");

//로그인
router.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ message: "데이터형식을 확인해주세요" });
    }
    try {
        const user = await Users.findOne({ where: { email } });
        if (user == null) {
            return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
        }
        const is = await bcrypt.compare(password, user.password)
        console.log(is)
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: "비밀번호가 틀렸습니다." });
        }
        const token = jwt.sign({ user }, process.env.JWT_KEY, { expiresIn: "12h" });
        return res.status(200).json({ accessToken: token });
    } catch (error) {
        console.log(error)
    }
});

module.exports = router