import { Router } from 'express';
import { needSignIn } from '../middlewores/need-middleware.js';
const usersRouter = Router();

usersRouter.get('/me', needSignIn, (req, res) => {
    try {
        const me = res.locals.user;
        return res.status(200).json({
            success: true,
            message: '내 정보 조회에 성공했습니다.',
            data: me
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: '예상치 못한 에러가 발생하였습니다. 관리자에게 문의하여주세요.',
        });
    }
})

export { usersRouter } 