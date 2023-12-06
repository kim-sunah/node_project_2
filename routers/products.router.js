import { Router } from "express";
import { needSignIn } from "../middlewores/need-middleware.js";
import { Sequelize } from 'sequelize';
import db from "../models/index.cjs"
const productRouter = Router();
const { products, users } = db;

//생성
productRouter.post('', needSignIn, async (req, res) => {
    try {
        const { id: userId, name: userName } = res.locals.user;
        const { title, description } = req.body;
        console.log(req.body)

        if (!title) {
            return res.status(400).json({
                success: false,
                message: '제목 입력이 필요합니다.',
            })
        }

        if (!description) {
            return res.status(400).json({
                success: false,
                message: '내용 입력이 필요합니다.',
            })
        }

        const product = (await products.create({ title, description, userId })).toJSON();

        return res.status(201).json({
            success: true,
            message: '상품생성에 성공했습니다.',
            data: { ...product, userName },
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하여주세요.',
        });
    }
})

//목록조회
productRouter.get('', async (req, res) => {
    try {
        const { sort } = req.query;
        let upperCase = sort?.toUpperCase();
        if (upperCase !== 'ASC' && upperCase !== 'DESC') {
            upperCase = 'DESC'
        }
        const product = (await products.findAll({
            attributes: [
                'id',
                'title',
                'description',
                'status',
                'userId',
                [Sequelize.col('user.name'), 'userName'],
                'createdAt',
                'updatedAt',
            ],
            order: [['createdAt', upperCase]], include: { model: users, as: 'user', attributes: [] }
        }))
        return res.status(200).json({
            success: true,
            message: '상품목록 조회에 성공했습니다.',
            data: product
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하여주세요.',
        });
    }
})
//상세조회
productRouter.get('/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await products.findByPk(productId, {
            attributes: [
                'id',
                'title',
                'description',
                'status',
                'userId',
                [Sequelize.col('user.name'), 'userName'],
                'createdAt',
                'updatedAt',
            ],
            include: { model: users, as: 'user', attributes: [] }
        })
        return res.status(200).json({
            success: true,
            message: '상세정보 조회에 성공했습니다.',
            data: product
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하여주세요.',
        });
    }
})
//수정
productRouter.put('/:productId', needSignIn, async (req, res) => {
    try {
        const { productId } = req.params;
        const { title, description, status } = req.body;
        console.log(res.locals.user)
        const { id: userId, name: userName } = res.locals.user;

        //수정 정보가 하나도 없는경우
        if (!title && !description && !status) {
            return res.status(400).json({
                success: false,
                message: '수정정보는 최소 한가지 이상이어야 합니다.',
            });
        }

        //status 값이 다를 경우
        const isValidStatus = status ? status === 'FOR_SALE' || status === 'SOLD_OUT' : true
        if (!isValidStatus) {
            return res.status(400).json({
                success: false,
                message: '지원하지 않는 상태입니다. ',
            });
        }

        //일치하는 상품이 존재하지 않는경우
        const product = await products.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '상품조회에 실패하였습니다.',
            });
        }
        //작성자id 와 상품정보 userId 가 일치하지 않는 경우
        const isProductOwner = product.userId === userId;
        if (!isProductOwner) {
            return res.status(403).json({
                success: false,
                message: '상품수정 권한이 없습니다.',
            });
        }

        await product.update({
            ...(title && { title }),
            ...(description && { description }),
            ...(status && { status }),
        }, { where: { productId: productId } })

        const updatedProduct = {
            ...product.toJSON(),
            userName
        };
        return res.status(200).json({
            success: true,
            message: '상품 수정에 성공했습니다.',
            data: updatedProduct
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하여주세요.',
        });
    }
})
//삭제
productRouter.delete('/:productId', needSignIn, async (req, res) => {
    try {
        const { productId } = req.params;
        const { id: userId, name: userName } = res.locals.user;

        //일치하는 상품이 존재하지 않는경우
        const product = await products.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: '상품조회에 실패하였습니다.',
            });
        }
        //작성자id 와 상품정보 userId 가 일치하지 않는 경우
        const isProductOwner = product.userId === userId;
        if (!isProductOwner) {
            return res.status(403).json({
                success: false,
                message: '상품삭제 권한이 없습니다.',
            });
        }
        await product.destroy({ where: { id: product.id } })
        const deleteProduct = { ...product.toJSON(), id: productId };

        return res.status(200).json({
            success: true,
            message: '상품 삭제에 성공했습니다.',
            data: deleteProduct
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하여주세요.',
        });
    }
})
export { productRouter }