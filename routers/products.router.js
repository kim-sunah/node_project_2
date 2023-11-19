const express = require("express");
const { Users, Products } = require("../models");
const router = express.Router();
const authMiddleware = require('../middlwares/need-signin.middlware')
const productInfo = require('../middlwares/returnProduct.middleware')

router.post("/products", authMiddleware, async (req, res, next) => {
    const { title, content } = req.body;
    const userId = res.locals.user.id
    try {
        await Products.create({
            title,
            content,
            userId,
        });
        res.status(201).json({ message: "판매 상품을 등록하였습니다." });
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

router.put("/products/:id", authMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const { title, content, status } = req.body;
    const products = await Products.findOne({ where: { id } });
    if (products == null) {
        res.status(404).json({ message: "상품 조회에 실패하였습니다." });
        return
    } else if (products.userId !== res.locals.user.id) {
        res.status(401).json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
        return
    }


    try {
        if (status === "FOR_SALE" || status === "SOLD_OUT") {
            await products.update({ title, content, status });
            res.send({ message: "상품 정보를 수정하였습니다." });

        } else {
            return res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }

    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
    }
});

router.delete("/products/:id", authMiddleware, async (req, res, next) => {
    const { id } = req.params;
    const userId = res.locals.user.id
    const products = await Products.findOne({ where: { id } });
    if (products == null) {
        res.status(404).json({ message: "상품 조회에 실패하였습니다." });
    } else if (products.userId !== res.locals.user.id) {
        res
            .status(401)
            .json({ message: "상품을 수정할 권한이 존재하지 않습니다." });
    } else {
        try {
            await Products.destroy({ where: { id } });
            res.json({ message: "상품을 삭제하였습니다." });
        } catch (err) {
            res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }
    }
});

router.get("/products", async (req, res) => {
    const products = await Products.findAll({
        include: [
            { model: Users, as: "users", attributes: ["name"] }
        ],
        order: [["createdAt", "DESC"]]
    });

    res.json({ date: products });
});

router.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const products = await Products.findOne({
        include: [
            { model: Users, as: "users", attributes: ["name"] }
        ],
        where: { id },
        order: [["createdAt", "DESC"]]
    });
    if (products == null) {
        res.status(404).json({ message: "상품조회에 실패하였습니다." });
    } else {
        try {
            console.log(products)
            // productInfo(products)
            res.json({ date: products });
        } catch (err) {
            res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        }
    }
});

module.exports = router